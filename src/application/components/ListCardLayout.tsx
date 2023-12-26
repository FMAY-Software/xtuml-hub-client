import { Button, Flex, Input, Table } from "antd";
import { AppstoreOutlined, OrderedListOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";

export interface ListCardLayoutProperties {
  handleSearch: (value: string) => void;
  cards: JSX.Element[];
  dataSource: AnyObject[] | undefined;
  columns: any; // TODO: determine how to properly type
}

const ListCardLayout = (properties: ListCardLayoutProperties) => {
  const [listView, setListView] = useState<boolean>(false);
  const { cards, columns, dataSource, handleSearch } = properties;
  const toggleListView = () => {
    setListView(!listView);
  };
  return (
    <Flex
      className="xhub-h-full"
      align="start"
      justify="start"
      vertical
      gap={20}
      style={{ padding: 20 }}
    >
      <Flex align="center" justify="center" className="xhub-w-full">
        <Input
          placeholder="Search hub for any xtUML artifact..."
          size="large"
          onChange={(value) => handleSearch(value.target.value)}
          style={{ width: "50%" }}
        />
        {listView ? (
          <Button
            style={{ marginLeft: 24 }}
            icon={<OrderedListOutlined style={{ fontSize: 18 }} />}
            onClick={() => toggleListView()}
          />
        ) : (
          <Button
            style={{ marginLeft: 24 }}
            icon={<AppstoreOutlined style={{ fontSize: 18 }} />}
            onClick={() => toggleListView()}
          />
        )}
      </Flex>
      {!listView && (
        <Flex align="center" justify="start" gap={20}>
          {cards}
        </Flex>
      )}
      {listView && (
        <Table
          size="small"
          className="xhub-w-full"
          columns={columns}
          dataSource={dataSource}
        />
      )}
    </Flex>
  );
};

export default ListCardLayout;
