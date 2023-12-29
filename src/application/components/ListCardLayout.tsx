import { Flex, Table } from "antd";
import { useState } from "react";
import { AnyObject } from "antd/es/_util/type";

export interface ListCardLayoutProperties {
  criteria: string;
  listView: boolean;
  cards: JSX.Element[];
  dataSource: AnyObject[] | undefined;
  columns: any; // TODO: determine how to properly type
}

const ListCardLayout = (properties: ListCardLayoutProperties) => {
  const { criteria, listView, cards, columns, dataSource } = properties;

  const getResults = (
    criteria: string,
    listView: boolean
  ): JSX.Element | undefined => {
    if (!listView) {
      if (cards.length > 0) {
        return (
          <Flex align="center" justify="start" gap={20} wrap="wrap">
            {cards}
          </Flex>
        );
      }
      if (criteria) {
        return (
          <Flex className="xhub-w-full" align="center" justify="center">
            No Artifacts Found
          </Flex>
        );
      }
      return undefined;
    }
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
      {getResults(criteria, listView)}
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
