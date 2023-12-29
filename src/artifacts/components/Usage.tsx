import { useState } from "react";
import { Artifact } from "../model/artifact";
import { Button, Col, Flex, Input, Space } from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useArtifactDispatch } from "../../store/nodes/artifacts/artifactHooks";
import { updateStagingArtifact } from "../../store/nodes/artifacts/stagingArtifactSlice";

const { TextArea } = Input;

export interface UsageProperties {
  artifact: Artifact;
  readonly: boolean;
}
const Usage = (props: UsageProperties) => {
  const { artifact, readonly } = props;
  const [editing, setEditing] = useState<boolean>(false);
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const dispatch = useArtifactDispatch();

  const handleEditClick = () => {
    setEditing(true);
    setEditedMarkdown(artifact.usage ?? "");
  };

  const handleSaveClick = () => {
    const updated = {
      ...artifact,
      usage: editedMarkdown,
    };
    dispatch(updateStagingArtifact(updated));
    setEditedMarkdown("");
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  return (
    <Col span={11} className="xhub-h-full">
      {!editing ? (
        <Flex
          align="flex-start"
          justify="flex-start"
          vertical
          className="xhub-h-full xhub-w-full"
        >
          <Flex
            align="flex-start"
            justify="flex-start"
            className="xhub-h-full xhub-w-full"
            vertical
            style={{
              marginBottom: 20,
              minHeight: "calc(100vh - 250px)",
              maxHeight: "calc(100vh - 250px)",
              overflowY: "auto",
            }}
          >
            <ReactMarkdown remarkPlugins={[gfm]}>
              {artifact.usage ?? "Edit To Provide Usage"}
            </ReactMarkdown>
          </Flex>
          {!readonly && (
            <Flex align="center" justify="flex-end" className="xhub-w-full">
              <Button icon={<EditOutlined />} onClick={handleEditClick}>
                Edit
              </Button>
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex
          className="xhub-w-full xhub-h-full"
          align="flex-start"
          justify="flex-start"
          vertical
          gap={20}
        >
          <TextArea
            value={editedMarkdown}
            onChange={(e) => setEditedMarkdown(e.target.value)}
            className="xhub-w-full xhub-h-full"
            style={{ minHeight: "unset", height: "100%", resize: "none" }}
          />
          <Flex
            className="xhub-w-full"
            align="center"
            justify="flex-end"
            gap={10}
          >
            <Button icon={<CloseCircleOutlined />} onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSaveClick}>
              Save
            </Button>
          </Flex>
        </Flex>
      )}
    </Col>
  );
};

export default Usage;
