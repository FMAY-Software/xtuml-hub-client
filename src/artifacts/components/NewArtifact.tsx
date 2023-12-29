import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { RcFile } from "antd/lib/upload/interface";
import { Artifact } from "../model/artifact";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/firebase/firebase";

interface NewArtifactProperties {
  show: boolean;
  onCancel: () => void;
  onComplete: (data: Artifact) => void; // Adjust the type as needed
}

const NewArtifact: React.FC<NewArtifactProperties> = ({
  show,
  onCancel,
  onComplete,
}) => {
  const [form] = Form.useForm();
  const user = useAuthState(auth);
  const handleComplete = () => {
    form.validateFields().then((values) => {
      // Include additional processing or validations as needed
      const data = {
        artifactId: `${values.name}-staged`,
        owner: user[0]!.email!, // TODO: replace with logged in user
        name: values.name,
        description: values.description,
        last_modified: new Date().toISOString(),
        types: [],
        files: [],
      };

      // Pass the data to the parent component or perform any desired action
      onComplete(data);

      // Clear the form and close the modal
      form.resetFields();
      onCancel();
    });
  };

  return (
    <Modal
      open={show}
      title="Create Artifact"
      footer={
        <div
          className="xhub-w-full"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            key="ok"
            type="primary"
            style={{ color: "black" }}
            onClick={handleComplete}
          >
            OK
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Enter the artifact name" }]}
        >
          <Input placeholder="Enter the name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            autoSize={{ minRows: 10, maxRows: 10 }}
            placeholder="Enter the artifact description"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewArtifact;
