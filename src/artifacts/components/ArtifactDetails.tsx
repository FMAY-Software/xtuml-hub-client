import { useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Tag,
  Row,
  Col,
  Divider,
  Input,
  Flex,
} from "antd";
import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ArtifactUploads from "./ArtifactUploads";
import { Artifact } from "../model/artifact";
import { useArtifactDispatch } from "../../store/nodes/artifacts/artifactHooks";
import { FileArtifact } from "../model/file_artifact";
import { updateStagingArtifact } from "../../store/nodes/artifacts/stagingArtifactSlice";
import FileTable, { FileTableRow } from "./FileTable";
import Usage from "./Usage";
import { get_signed_urls } from "../../api/get_signed_urls";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const { TextArea } = Input;

export interface ArtifactDetailsProperties {
  artifact: Artifact;
  setOpenedArtifact: (artifact: Artifact | undefined) => void;
  readonly: boolean;
}

const ArtifactDetails = (props: ArtifactDetailsProperties) => {
  const { artifact, setOpenedArtifact, readonly } = props;
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [nameEdit, setNameEdit] = useState<string>(artifact.name);
  const [editingDescription, setEditingDescription] = useState<boolean>(false);
  const [descriptionEdit, setDescriptionEdit] = useState<string>(
    artifact.description
  );
  const [editingDependencies, setEditingDependencies] =
    useState<boolean>(false);
  const [dependenciesEdit, setDependenciesEdit] = useState<string>(
    artifact.dependencies ?? ""
  );
  const dispatch = useArtifactDispatch();

  const handleFileUpload = (files: FileArtifact[]) => {
    const existingFiles = artifact.files ? artifact.files : [];
    const newFiles = [...existingFiles, ...files];
    const update = {
      ...artifact,
      types: getUniqueFileTypes(newFiles),
      files: newFiles,
    };
    dispatch(updateStagingArtifact(update));
  };

  const saveName = () => {
    const update = { ...artifact, name: nameEdit, lastName: artifact.name };
    dispatch(updateStagingArtifact(update));
    setEditingName(false);
  };

  const saveDescription = () => {
    const update = { ...artifact, description: descriptionEdit };
    dispatch(updateStagingArtifact(update));
    setEditingDescription(false);
  };

  const saveDependencies = () => {
    const update = { ...artifact, dependencies: dependenciesEdit };
    dispatch(updateStagingArtifact(update));
    setEditingDependencies(false);
  };

  const handleDeleteFile = (fileIndex: number) => {
    const updatedFiles = [...artifact.files];
    updatedFiles.splice(fileIndex, 1);

    const update = {
      ...artifact,
      files: updatedFiles,
    };

    dispatch(updateStagingArtifact(update));
  };

  const getUniqueFileTypes = (files: FileArtifact[]) => {
    const uniqueTypes: string[] = [];
    files.forEach((file) => {
      if (file.type && !uniqueTypes.includes(file.type)) {
        uniqueTypes.push(file.type);
      }
    });
    return uniqueTypes;
  };

  const handleDownloadAll = async () => {
    // Extract S3 keys from artifact.files
    const fileKeys = artifact.files.map((file: FileArtifact) => file.url);

    try {
      // Call the get_signed_urls API function for download
      const response = await get_signed_urls(fileKeys, false);

      if (response && response.signed_urls) {
        const zip = new JSZip();

        // Add each file to the zip
        for (const key in response.signed_urls) {
          const downloadUrl = response.signed_urls[key];
          const fileName = key.split("/")[1];

          // Fetch the file content
          const fileContent = await fetch(downloadUrl).then((res) =>
            res.blob()
          );

          // Add file to the zip
          zip.file(fileName, fileContent);
        }

        // Generate a blob containing the zip file
        const zipBlob = await zip.generateAsync({ type: "blob" });

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(zipBlob);
        downloadLink.download = `${artifact.name}.zip`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.error("Error retrieving signed URLs for download");
      }
    } catch (error) {
      console.error("Error handling download:", error);
      // Handle the error as needed
    }
  };

  return (
    <Card
      title={
        <Flex align="flex-start" justify="flex-start" className="xhub-w-full">
          <Flex align="center" justify="flex-start" className="xhub-w-full">
            {!readonly && (
              <Button
                style={{ marginRight: 10 }}
                onClick={() => {
                  if (!editingName) {
                    setEditingName(true);
                  } else {
                    saveName();
                  }
                }}
                icon={editingName ? <SaveOutlined /> : <EditOutlined />}
              />
            )}
            {editingName ? (
              <Input
                value={nameEdit}
                onChange={(event) => setNameEdit(event.target.value)}
              />
            ) : (
              `${artifact.name}`
            )}
          </Flex>
          <Flex align="center" justify="flex-end" className="xhub-w-full">
            <Button
              onClick={() => setOpenedArtifact(undefined)}
              icon={<CloseOutlined />}
            />
          </Flex>
        </Flex>
      }
      className="xhub-w-full xhub-h-full"
      bodyStyle={{ height: "calc(100% - 65px)" }}
    >
      <Row gutter={16} className="xhub-h-full">
        <Col span={12}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Short Description">
              <Flex
                align="center"
                justify="space-between"
                className="xhub-w-full"
              >
                <Flex
                  align="center"
                  justify="flex-start"
                  className="xhub-w-full"
                >
                  {editingDescription ? (
                    <Input
                      value={descriptionEdit}
                      onChange={(event) =>
                        setDescriptionEdit(event.target.value)
                      }
                    />
                  ) : (
                    `${
                      artifact.description && artifact.description !== ""
                        ? artifact.description
                        : "No description"
                    }`
                  )}
                </Flex>
                {!readonly && (
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      if (!editingDescription) {
                        setEditingDescription(true);
                      } else {
                        saveDescription();
                      }
                    }}
                    icon={
                      editingDescription ? <SaveOutlined /> : <EditOutlined />
                    }
                  />
                )}
              </Flex>
            </Descriptions.Item>
            <Descriptions.Item label="Type Associations">
              {getUniqueFileTypes(artifact.files).map((type) => (
                <Tag color="green" key={type}>
                  {type}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Dependencies">
              <Flex
                align="center"
                justify="space-between"
                className="xhub-w-full"
              >
                <Flex
                  align="center"
                  justify="flex-start"
                  className="xhub-w-full"
                >
                  {editingDependencies ? (
                    <Input
                      value={dependenciesEdit}
                      onChange={(event) =>
                        setDependenciesEdit(event.target.value)
                      }
                    />
                  ) : (
                    `${
                      artifact.dependencies && artifact.dependencies !== ""
                        ? artifact.dependencies
                        : "No dependencies"
                    }`
                  )}
                </Flex>
                {!readonly && (
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      if (!editingDependencies) {
                        setEditingDependencies(true);
                      } else {
                        saveDependencies();
                      }
                    }}
                    icon={
                      editingDependencies ? <SaveOutlined /> : <EditOutlined />
                    }
                  />
                )}
              </Flex>
            </Descriptions.Item>
            <Descriptions.Item label="Files">
              <FileTable
                includeTypeColumn={false}
                showHeader={false}
                files={artifact.files}
                readonly={readonly}
                deleteFunction={(
                  text: string,
                  record: FileTableRow,
                  index: number
                ) => (
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDeleteFile(index)}
                  >
                    Delete
                  </Button>
                )}
              />
            </Descriptions.Item>
            {!readonly ? (
              <div style={{ marginTop: 20 }}>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => setUploading(true)}
                >
                  Add Files
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: 20 }}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadAll()}
                >
                  Download Files
                </Button>
              </div>
            )}
          </Descriptions>
        </Col>
        <Col span={1}>
          <Divider
            type="vertical"
            style={{
              height: "100%",
              margin: 0,
              borderRight: "1px solid #d9f7be",
            }}
          />
        </Col>
        <Usage artifact={artifact} readonly={readonly} />
      </Row>

      <ArtifactUploads
        artifact={artifact}
        show={uploading}
        onComplete={(files: FileArtifact[]) => handleFileUpload(files)}
        onCancel={() => setUploading(false)}
        readonly={readonly}
      />
    </Card>
  );
};

export default ArtifactDetails;
