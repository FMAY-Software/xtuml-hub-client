import { Card } from "antd";
import { Artifact } from "../model/artifact";

export interface ArtifactInformationProperties {
  artifact: Artifact;
}

const ArtifactInformation = (props: ArtifactInformationProperties) => {
  const { artifact } = props;
  return (
    <Card
      hoverable
      title={artifact.name}
      style={{
        minWidth: 450,
        minHeight: 250,
        maxWidth: 450,
        maxHeight: 250,
        border: "1px solid #95de64", // Border color matching input hover borders
        // boxShadow: "0 4px 8px rgba(82, 196, 26, 0.2)", // Elevation effect
      }}
    />
  );
};
export default ArtifactInformation;
