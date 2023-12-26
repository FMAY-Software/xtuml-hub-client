import { App, ConfigProvider, theme } from "antd";
import Application from "./Application";
import { XHubThemes } from "../theme/XHubThemes";

const Root = () => {
  return (
    <ConfigProvider theme={XHubThemes.GreenTheme}>
      <App className="xhub-w-full xhub-h-full">
        <Application />
      </App>
    </ConfigProvider>
  );
};
export default Root;
