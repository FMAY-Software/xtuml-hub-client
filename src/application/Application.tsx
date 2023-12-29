import { Button, Flex, Layout, Tooltip, Typography } from "antd";
import Hub from "./sections/Hub";
import { Header } from "antd/es/layout/layout";
import { green } from "@ant-design/colors";
import HubFooter from "./footer/HubFooter";
import { useEffect, useState } from "react";
import { Artifact } from "../artifacts/model/artifact";
import ArtifactDetails from "../artifacts/components/ArtifactDetails";
import {
  useArtifactDispatch,
  useArtifactSelector,
} from "../store/nodes/artifacts/artifactHooks";
import StagingGate from "../authentication/StagingGate";
import { auth } from "../providers/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { LogoutOutlined } from "@ant-design/icons";
import { IoLogOut, IoLogOutOutline } from "react-icons/io5";
import { clearStagingArtifacts } from "../store/nodes/artifacts/stagingArtifactSlice";

const { Title } = Typography;

const Application = () => {
  const [staging, setStaging] = useState<boolean>(false);
  const [openedArtifact, setOpenedArtifact] = useState<Artifact>();
  const [user] = useAuthState(auth);
  const dispatch = useArtifactDispatch();

  const stagingArtifacts = useArtifactSelector((state) => state.staging);

  useEffect(() => {
    // update opened artifact if not undefined
    if (openedArtifact && stagingArtifacts.length > 0) {
      const update = stagingArtifacts.find(
        (a) =>
          a.name == openedArtifact.name || a.lastName == openedArtifact.name
      );
      setOpenedArtifact(update);
    }
  }, [stagingArtifacts]);

  const handleLogout = () => {
    setStaging(false);
    auth.signOut();
    dispatch(clearStagingArtifacts());
  };

  return staging && !user ? (
    <StagingGate />
  ) : (
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
        {user && (
          <Flex
            align="center"
            justify="center"
            className="xhub-h-full"
            style={{ marginRight: 10 }}
          >
            <Tooltip title="Logout">
              <Button style={{ padding: 4 }} onClick={() => handleLogout()}>
                <IoLogOutOutline style={{ fontSize: 24 }} />
              </Button>
            </Tooltip>
          </Flex>
        )}
      </Header>
      {openedArtifact ? (
        <ArtifactDetails
          artifact={openedArtifact}
          setOpenedArtifact={setOpenedArtifact}
          readonly={!staging}
        />
      ) : (
        <Hub
          staging={staging}
          setStaging={setStaging}
          openArtifact={setOpenedArtifact}
        />
      )}
      <Flex
        style={{ height: 24, backgroundColor: green[5] }}
        align="center"
        justify="center"
      >
        <HubFooter staging={staging} />
      </Flex>
    </Layout>
  );
};
export default Application;
