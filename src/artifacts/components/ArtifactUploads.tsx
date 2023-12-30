import React, { useState } from "react";
import { Modal, Form, Select, Upload, Button, Table, Space, Flex } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload/interface";
import { FileArtifact } from "../model/file_artifact";
import { FileType } from "../model/file_type";
import { IoAdd } from "react-icons/io5";
import FileTable from "./FileTable";
import { get_signed_urls } from "../../api/get_signed_urls";
import { Artifact } from "../model/artifact";

const { Option } = Select;

interface ArtifactUploadsProps {
  artifact: Artifact;
  show: boolean;
  onCancel: () => void;
  onComplete: (files: FileArtifact[]) => void;
  readonly: boolean;
}

interface StagedFile {
  id: string;
  type: FileType;
  file: RcFile;
}

const ArtifactUploads: React.FC<ArtifactUploadsProps> = ({
  artifact,
  show,
  onCancel,
  onComplete,
  readonly,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [showAddFile, setShowAddFile] = useState<boolean>(true);

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2);
  };

  const handleAddFile = () => {
    setShowAddFile(false);
  };

  const handleUpload = async () => {
    form.validateFields().then(async (values) => {
      const newStagedFiles = await Promise.all(
        fileList.map(async (file) => ({
          id: generateUniqueId(),
          type: values.type,
          file: file,
        }))
      );

      setStagedFiles((prevFiles) => [...prevFiles, ...newStagedFiles]);
      setFileList([]);
      form.resetFields();
      setShowAddFile(true);
    });
  };

  const handleDeleteFile = (id: string) => {
    setStagedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleOK = async () => {
    try {
      // Extract file names from stagedFiles
      const fileNames = stagedFiles.map(
        (s) => `${artifact.name}/${s.file.name}`
      );

      // Assuming get_signed_urls supports multiple file names in a single call
      const signedUrlsResponse = await get_signed_urls(fileNames, true);

      const fileArtifacts: FileArtifact[] = [];

      // Upload each file to S3 using signed URL
      await Promise.all(
        stagedFiles.map(async (file, index) => {
          const fileName = file.file.name;
          const signedUrl =
            signedUrlsResponse.signed_urls[`${artifact.name}/${fileName}`];

          // Use fetch to upload file to signed URL
          await fetch(signedUrl, {
            method: "PUT",
            body: (file.file as unknown as { originFileObj: any })
              .originFileObj,
            headers: {
              "Content-Type": "",
            },
          });

          const fileArtifact = {
            name: fileName,
            size: file.file.size,
            type: file.type,
            url: `${artifact.name}/${fileName}`,
          };

          fileArtifacts.push(fileArtifact);
        })
      );

      onComplete(fileArtifacts);
      onCancel();
      setStagedFiles([]);
    } catch (error) {
      // Handle error
      console.error("Error uploading files:", error);
      // You may want to add error handling, such as displaying an error message to the user.
    }
  };

  return (
    <Modal
      open={show}
      title="Configure Artifact"
      onCancel={onCancel}
      footer={
        <Flex align="center" justify="flex-end">
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            key="ok"
            type="primary"
            style={{ color: "black" }}
            onClick={handleOK}
          >
            OK
          </Button>
        </Flex>
      }
    >
      {showAddFile ? (
        <Button onClick={handleAddFile}>
          <IoAdd />
          Add File
        </Button>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select the type" }]}
          >
            <Select placeholder="Select the type">
              <Option value="Pure">Pure</Option>
              <Option value="Oal">Oal</Option>
              <Option value="Masl">Masl</Option>
              <Option value="C">C</Option>
              <Option value="C++">C++</Option>
              <Option value="Java">Java</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="files"
            label="Upload Files"
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => {
              setFileList(fileList);
              return fileList;
            }}
          >
            <Upload
              multiple
              beforeUpload={() => false}
              fileList={fileList}
              accept=".xtuml, .c, .h, .cpp, .java"
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
          </Form.Item>

          <Button onClick={handleUpload}>Add</Button>
        </Form>
      )}

      {stagedFiles.length > 0 && (
        <FileTable
          files={stagedFiles.map((file) => ({
            key: file.id,
            type: file.type,
            name: file.file.name,
            size: file.file.size,
            id: file.id,
            url: "",
          }))}
          deleteFunction={(
            text: string,
            record: FileArtifact,
            index: number
          ) => (
            <Space size="middle">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteFile(record.id!)}
              />
            </Space>
          )}
          includeTypeColumn={true}
          showHeader={true}
          readonly={readonly}
        />
      )}
    </Modal>
  );
};

export default ArtifactUploads;
