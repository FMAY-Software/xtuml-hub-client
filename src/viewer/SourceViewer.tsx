import { Flex, Modal } from "antd";
import { useEffect, useState } from "react";
import { FileArtifact } from "../artifacts/model/file_artifact";
import { get_signed_urls } from "../api/get_signed_urls";
import { SignedUrlResponse } from "../api/model/signed_url_response";

export interface SourceViewerProperties {
  file: FileArtifact;
  handleClose: () => void;
  show: boolean;
}

const SourceViewer = (props: SourceViewerProperties) => {
  const { handleClose, file, show } = props;
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileContent = async () => {
      const response: SignedUrlResponse = await get_signed_urls(
        [file.url],
        false
      );
      // we only have one
      const contentUrl = response.signed_urls[file.url];
      const content = await (await fetch(contentUrl)).text();
      setFileContent(content);
    };

    if (file && show) {
      fetchFileContent();
    }
  }, [file, show]);

  return (
    <Modal
      open={show}
      onCancel={() => {
        setFileContent("");
        handleClose();
      }}
      title={file?.name}
      footer={null}
      width="75%"
      styles={{ body: { paddingTop: 10 } }}
    >
      {fileContent !== null ? (
        <Flex
          vertical
          style={{
            minHeight: "calc(100vh - 250px)",
            maxHeight: "calc(100vh - 250px)",
            overflow: "auto",
          }}
        >
          <pre>{fileContent}</pre>
        </Flex>
      ) : (
        <p>Loading file content...</p>
      )}
    </Modal>
  );
};

export default SourceViewer;
