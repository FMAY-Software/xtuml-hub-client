import { Flex, Typography } from "antd";

const { Text } = Typography;

const HubFooter = () => {
  return (
    <Flex align="center" justify="space-between" className="xhub-w-full">
      <Text style={{ marginLeft: 20 }}>Provided by: FMAY Software</Text>
      <Text style={{ marginRight: 20 }}>Total Hub Contributions: 25,000</Text>
    </Flex>
  );
};
export default HubFooter;
