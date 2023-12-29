import { useState } from "react";
import { Button, Col, Flex, Tooltip } from "antd";
import useArtifacts from "../../artifacts/selection/useArtifacts";
import ArtifactBrief from "../../artifacts/components/ArtifactBrief";
import { ArtifactColumns } from "../table/artifact_columns";
import ListCardLayout from "../components/ListCardLayout";
import SearchHub from "../components/Search";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { IoCreateOutline } from "react-icons/io5";
import NewArtifact from "../../artifacts/components/NewArtifact";
import { Artifact } from "../../artifacts/model/artifact";
import { useArtifactDispatch } from "../../store/nodes/artifacts/artifactHooks";
import { addStagingArtifact } from "../../store/nodes/artifacts/stagingArtifactSlice";
import ArtifactFinalizer from "../../artifacts/components/ArtifactFinalizer";

export interface HubProperties {
  staging: boolean;
  setStaging: (value: boolean) => void;
  openArtifact: (artifact: Artifact) => void;
}

const Hub = (props: HubProperties) => {
  const { staging, setStaging, openArtifact } = props;
  const [listView, setListView] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<string>("");
  const [creatingArtifact, setCreatingArtifact] = useState<boolean>(false);
  const [finalizing, setFinalizing] = useState<boolean>(false);
  const { artifacts } = useArtifacts(criteria, staging);
  const dispatch = useArtifactDispatch();

  const handleSearch = (value: string) => {
    setCriteria(value);
  };

  const toggleListView = () => {
    setListView(!listView);
  };

  const toggleStaging = () => {
    setStaging(!staging);
  };

  const stageArtifact = (artifact: Artifact) => {
    dispatch(addStagingArtifact(artifact));
  };

  return (
    <Flex className="xhub-w-full xhub-h-full" vertical>
      <Col className="xhub-w-full" style={{ marginTop: 20 }}>
        <Flex align="center" justify="center" className="xhub-w-full">
          {staging ? (
            <Tooltip title="Switch To Hub">
              <Button
                style={{ marginRight: 24 }}
                icon={<IoCreateOutline style={{ fontSize: 18 }} />}
                onClick={() => toggleStaging()}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Switch to Staging">
              <Button
                style={{ marginRight: 24 }}
                icon={<DatabaseOutlined style={{ fontSize: 18 }} />}
                onClick={() => toggleStaging()}
              />
            </Tooltip>
          )}
          <SearchHub
            handleSearch={handleSearch}
            listView={listView}
            toggleListView={toggleListView}
          />
          {listView ? (
            <Tooltip title="Switch To Card View">
              <Button
                style={{ marginLeft: 24 }}
                icon={<OrderedListOutlined style={{ fontSize: 18 }} />}
                onClick={() => toggleListView()}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Switch To Table View">
              <Button
                style={{ marginLeft: 24 }}
                icon={<AppstoreOutlined style={{ fontSize: 18 }} />}
                onClick={() => toggleListView()}
              />
            </Tooltip>
          )}
        </Flex>
      </Col>
      <Col
        className="xhub-w-full xhub-h-full xhub-vscroll"
        style={{ marginBottom: 10 }}
      >
        <ListCardLayout
          criteria={criteria}
          listView={listView}
          cards={artifacts.map((a) => (
            <ArtifactBrief
              key={a.name}
              artifact={a}
              openArtifact={openArtifact}
              readonly={!staging}
            />
          ))}
          columns={ArtifactColumns}
          dataSource={artifacts}
        />
      </Col>
      {staging ? (
        <Flex>
          <Tooltip title="Finalize Artifacts">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckCircleOutlined style={{ color: "black" }} />}
              size="middle"
              style={{
                position: "absolute",
                bottom: 32,
                right: 64,
              }}
              onClick={() => {
                setFinalizing(true);
              }}
            />
          </Tooltip>
          <ArtifactFinalizer
            artifacts={artifacts}
            show={finalizing}
            onCancel={() => setFinalizing(false)}
            onCommit={() => setFinalizing(false)}
          />
        </Flex>
      ) : undefined}
      {staging ? (
        <Flex>
          <Tooltip title="Create New Artifact">
            <Button
              type="primary"
              shape="circle"
              icon={<FileAddOutlined style={{ color: "black" }} />}
              size="middle"
              style={{
                position: "absolute",
                bottom: 32,
                right: 16,
              }}
              onClick={() => {
                setCreatingArtifact(true);
              }}
            />
          </Tooltip>
          <NewArtifact
            show={creatingArtifact}
            onComplete={stageArtifact}
            onCancel={() => setCreatingArtifact(false)}
          />
        </Flex>
      ) : undefined}
    </Flex>
  );
};
export default Hub;
