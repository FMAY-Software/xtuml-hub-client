import { Artifact } from "../../artifacts/model/artifact";
import { Typography } from "antd";

const { Paragraph } = Typography;

export const ArtifactColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (text: string, record: Artifact, index: number) => (
      <Paragraph style={{ whiteSpace: "pre-line" }}>{text}</Paragraph>
    ),
  },
];
