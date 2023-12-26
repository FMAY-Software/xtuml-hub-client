import { useState } from "react";
import { green } from "@ant-design/colors";
import { Button, Flex, Input, Layout, Space, Table, Typography } from "antd";
import { AppstoreOutlined, OrderedListOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import useArtifacts from "./search/useArtifacts";
import ArtifactInformation from "../artifacts/components/ArtifactInformation";
import { ArtifactColumns } from "./table/artifact_columns";
import ListCardLayout from "./components/ListCardLayout";
import HubFooter from "./footer/HubFooter";

const { Title } = Typography;

const Application = () => {
  const [listView, setListView] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<string>("");

  const { artifacts } = useArtifacts(criteria);

  const handleSearch = (value: string) => {
    setCriteria(value);
  };

  const toggleListView = () => {
    setListView(!listView);
  };

  return (
    <Layout className="xhub-w-full xhub-h-full">
      <Header
        style={{
          backgroundColor: green[6],
          display: "flex",
          padding: 0,
          margin: 0,
          height: 48,
        }}
      >
        <Flex
          align="center"
          justify="right"
          className="xhub-h-full"
          style={{ marginLeft: 20 }}
        >
          <img
            src="/assets/logos/xtuml-hub.png"
            style={{ width: 28, height: 28 }}
          />
        </Flex>
        <Flex
          align="center"
          justify="center"
          className="xhub-h-full xhub-w-full"
        >
          <Title level={2} style={{ marginLeft: -20, color: "#262626" }}>
            xtUML Model Hub
          </Title>
        </Flex>
      </Header>
      <ListCardLayout
        cards={artifacts.map((a) => (
          <ArtifactInformation artifact={a} />
        ))}
        columns={ArtifactColumns}
        dataSource={artifacts}
        handleSearch={handleSearch}
      />
      <Flex
        style={{ height: 24, backgroundColor: green[5] }}
        align="center"
        justify="center"
      >
        <HubFooter />
      </Flex>
    </Layout>
  );
};
export default Application;
