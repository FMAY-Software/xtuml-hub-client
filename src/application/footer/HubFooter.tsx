import { Button, Flex, Typography } from "antd";
import { useArtifactSelector } from "../../store/nodes/artifacts/artifactHooks";

const { Text } = Typography;

export interface HubFooterProperties {
  staging: boolean;
}

const HubFooter = (props: HubFooterProperties) => {
  const { staging } = props;
  const artifacts = useArtifactSelector((state) => state.artifacts);
  const stagingArtifacts = useArtifactSelector((state) => state.staging);

  return (
    <Flex align="center" justify="space-between" className="xhub-w-full">
      <Flex align="center" justify="center">
        Provided by:
        <Button
          onClick={() => {
            window.open("http://fmay.net", "_blank");
          }}
          style={{
            width: 150,
            height: 16,
            padding: 4,
            marginLeft: 20,
            fontFamily: "Dancing Script",
          }}
        >
          FMAY Software
        </Button>
      </Flex>
      <Text style={{ marginRight: 20 }}>
        {staging
          ? `Total Staged Contributions: ${stagingArtifacts.length}`
          : `Total Hub Contributions: ${artifacts.length}`}
      </Text>
    </Flex>
  );
};
export default HubFooter;
