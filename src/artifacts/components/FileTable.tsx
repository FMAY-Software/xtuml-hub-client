import { Button, Table } from "antd";
import { FileType } from "../model/file_type";
import { formatFileSize } from "../util/files";
import { FileArtifact } from "../model/file_artifact";

export interface FileTableProperties {
  files: FileArtifact[];
  deleteFunction: (
    text: string,
    record: FileArtifact,
    index: number
  ) => JSX.Element;
  showHeader: boolean;
  includeTypeColumn: boolean;
  readonly: boolean;
  openSourceViewer?: (file: FileArtifact) => void;
}

const FileTable = (props: FileTableProperties) => {
  const {
    files,
    deleteFunction,
    showHeader,
    includeTypeColumn,
    readonly,
    openSourceViewer,
  } = props;
  let columns = [
    { title: "File Name", dataIndex: "name", key: "name" },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text: string, record: FileArtifact, index: number) =>
        formatFileSize(record.size),
    },
  ];
  if (includeTypeColumn) {
    columns = [
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      ...columns,
    ];
  }
  if (!readonly) {
    columns = [
      //@ts-ignore
      ...columns,
      {
        title: "Actions",
        key: "actions",
        //@ts-ignore
        render: deleteFunction,
      },
    ];
  }
  columns = [
    // @ts-ignore
    ...columns,
    {
      title: "View",
      key: "view",
      // @ts-ignore
      render: (text: string, record: FileTableRow, index: number) => {
        return (
          <Button
            onClick={() => {
              if (openSourceViewer) {
                openSourceViewer(record);
              }
            }}
          >
            View
          </Button>
        );
      },
    },
  ];
  return (
    <Table
      dataSource={files}
      columns={columns}
      pagination={false}
      showHeader={showHeader}
      size="small"
    />
  );
};
export default FileTable;
