import { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Flex, Typography } from "antd";
import { write_artifacts } from "../../api/write_artifacts";
import { Artifact } from "../model/artifact";
import {
  useArtifactDispatch,
  useArtifactSelector,
} from "../../store/nodes/artifacts/artifactHooks";
import { updateArtifactModificationNoTimeUpdate } from "../../store/nodes/artifacts/stagingArtifactSlice";
import { update_artifacts } from "../../api/update_artifacts";

const { Text } = Typography;

export interface ArtifactFinalizerProperties {
  artifacts: Artifact[];
  onCancel: () => void;
  onCommit: () => void;
  show: boolean;
}

const ArtifactFinalizer = (props: ArtifactFinalizerProperties) => {
  const { artifacts, onCancel, onCommit, show } = props;
  const [selectedArtifacts, setSelectedArtifacts] = useState<Artifact[]>([]);
  const [disabledArtifacts, setDisabledArtifacts] = useState<string[]>([]);
  const dispatch = useArtifactDispatch();

  const committedArtifacts = useArtifactSelector((state) => state.artifacts);

  useEffect(() => {
    // Identify artifacts that are up to date and disable them
    const upToDateArtifactIds = committedArtifacts
      .filter((committed) =>
        artifacts.some(
          (artifact) =>
            artifact.artifactId === committed.artifactId &&
            artifact.last_modified === committed.last_modified
        )
      )
      .map((committed) => committed.artifactId);

    setDisabledArtifacts(upToDateArtifactIds);
  }, [artifacts, committedArtifacts]);

  const handleCheckboxChange = (artifact: Artifact) => {
    const isSelected = selectedArtifacts.includes(artifact);
    if (isSelected) {
      setSelectedArtifacts((prevSelected) =>
        prevSelected.filter((selected) => selected !== artifact)
      );
    } else {
      setSelectedArtifacts((prevSelected) => [...prevSelected, artifact]);
    }
  };

  const handleCommit = async () => {
    // Perform the commit action, e.g., write to the database
    // write if id is staging, update otherwise
    const newArtifacts = selectedArtifacts.filter((a) =>
      a.artifactId.includes("staged")
    );
    const updateArtifacts = selectedArtifacts.filter(
      (a) => !a.artifactId.includes("staged")
    );

    if (newArtifacts.length > 0) {
      const newArtifactIds = await write_artifacts(selectedArtifacts);

      const updatedStagingArtifacts = artifacts.map((artifact, index) => ({
        ...artifact,
        artifactId: newArtifactIds[artifact.name],
      }));

      updatedStagingArtifacts.forEach((s) => {
        dispatch(updateArtifactModificationNoTimeUpdate(s));
      });
    }

    if (updateArtifacts.length > 0) {
      await update_artifacts(updateArtifacts);
    }

    // Call the parent component's commit handler
    onCommit();
  };

  return (
    <Modal
      title="Artifact Finalizer"
      open={show}
      onCancel={onCancel}
      footer={
        <Flex align="center" justify="flex-end" className="xhub-w-full">
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            key="commit"
            type="primary"
            onClick={handleCommit}
            style={{ color: "black" }}
            disabled={!selectedArtifacts.length}
          >
            Commit
          </Button>
        </Flex>
      }
    >
      {artifacts.map((artifact) => (
        <Flex
          key={artifact.artifactId}
          align="center"
          justify="flex-start"
          className="xhub-w-full"
        >
          <Checkbox
            style={{ transform: "scale(0.5)" }}
            onChange={() => handleCheckboxChange(artifact)}
            checked={selectedArtifacts.includes(artifact)}
            disabled={disabledArtifacts.includes(artifact.artifactId)}
          />
          <span style={{ marginLeft: 10 }}>{artifact.name}</span>
          {disabledArtifacts.includes(artifact.artifactId) && (
            <Text type="success" style={{ marginLeft: 10 }}>
              (Up to date)
            </Text>
          )}
        </Flex>
      ))}
    </Modal>
  );
};

export default ArtifactFinalizer;
