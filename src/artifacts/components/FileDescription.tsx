import { Flex } from "antd";
import { FileArtifact } from "../model/file_artifact";
import { CgCPlusPlus } from "react-icons/cg";
import { SiC, SiOpenjdk } from "react-icons/si";
import { LiaProjectDiagramSolid } from "react-icons/lia";
export interface FileDescriptionProperties {
  file: FileArtifact;
}

const FileDescription = (props: FileDescriptionProperties) => {
  const getIcon = () => {
    switch (props.file.type) {
      case "C":
        return <span style={{ fontSize: 14 }}>C</span>;
      case "C++":
        return <CgCPlusPlus />;
      case "Pure":
        return <LiaProjectDiagramSolid />;
      case "Java":
        return <SiOpenjdk />;
    }
  };
  return (
    <Flex align="center" justify="flex-start" gap={10}>
      {getIcon()}
      {props.file.name}
    </Flex>
  );
};

export default FileDescription;
