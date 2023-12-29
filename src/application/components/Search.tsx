import { Input } from "antd";

export interface SearchHubProperties {
  handleSearch: (value: string) => void;
  listView: boolean;
  toggleListView: () => void;
}

const SearchHub = (props: SearchHubProperties) => {
  const { handleSearch, listView, toggleListView } = props;
  return (
    <Input
      placeholder="Search hub for any xtUML artifact..."
      size="large"
      onChange={(value) => handleSearch(value.target.value)}
      style={{ width: "50%" }}
    />
  );
};
export default SearchHub;
