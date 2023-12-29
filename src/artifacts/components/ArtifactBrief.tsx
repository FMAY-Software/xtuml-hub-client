import { Button, Card, Flex, Row, Tag } from "antd";
import { Artifact } from "../model/artifact";
import { DeleteOutlined } from "@ant-design/icons";
import { removeStagingArtifact } from "../../store/nodes/artifacts/stagingArtifactSlice";
import { useArtifactDispatch } from "../../store/nodes/artifacts/artifactHooks";

export interface ArtifactBriefProperties {
  artifact: Artifact;
  openArtifact: (artifact: Artifact) => void;
  readonly: boolean;
}

const ArtifactBrief = (props: ArtifactBriefProperties) => {
  const { artifact, openArtifact, readonly } = props;
  const dispatch = useArtifactDispatch();

  return (
    <Card
      onClick={() => openArtifact(artifact)}
      hoverable
      title={
        <Flex
          align="center"
          justify="space-between"
          gap={10}
          className="xhub-w-full"
        >
          {artifact.name}
          {!readonly && (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                dispatch(removeStagingArtifact(artifact));
              }}
              icon={<DeleteOutlined />}
            />
          )}
        </Flex>
      }
      style={{
        minWidth: 450,
        minHeight: 250,
        maxWidth: 450,
        maxHeight: 250,
        border: "1px solid #95de64", // Border color matching input hover borders
        display: "flex",
        flexDirection: "column",
      }}
      bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <Row style={{ flex: 1, marginBottom: "auto" }}>
        {artifact.description}
      </Row>
      <Row style={{ marginTop: "auto" }}>
        {artifact.types &&
          artifact.types.map((type) => (
            <Tag key={type} color="green">
              {type}
            </Tag>
          ))}
      </Row>
    </Card>
  );
};

export default ArtifactBrief;
