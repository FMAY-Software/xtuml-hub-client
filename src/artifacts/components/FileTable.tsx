import { Table } from "antd";
import { FileType } from "../model/file_type";
import { formatFileSize } from "../util/files";

export interface FileTableRow {
  name: string;
  size: number;
  type?: FileType;
  id?: string;
}

export interface FileTableProperties {
  files: FileTableRow[];
  deleteFunction: (
    text: string,
    record: FileTableRow,
    index: number
  ) => JSX.Element;
  showHeader: boolean;
  includeTypeColumn: boolean;
  readonly: boolean;
}

const FileTable = (props: FileTableProperties) => {
  const { files, deleteFunction, showHeader, includeTypeColumn, readonly } =
    props;
  let columns = [
    { title: "File Name", dataIndex: "name", key: "name" },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text: string, record: FileTableRow, index: number) =>
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
