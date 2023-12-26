import ListCardLayout from "../components/ListCardLayout";

export interface CategoriesProperties {
  handleSearch: (value: string) => void;
}

const Categories = (properties: CategoriesProperties) => {
  const { handleSearch } = properties;
  return (
    <ListCardLayout
      cards={[]}
      columns={[]}
      dataSource={[]}
      handleSearch={handleSearch}
    />
  );
};

export default Categories;
