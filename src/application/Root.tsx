import { App, ConfigProvider, theme } from "antd";
import Application from "./Application";
import { XHubThemes } from "../theme/XHubThemes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/xhub";

const Root = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider theme={XHubThemes.GreenTheme}>
          <App className="xhub-w-full xhub-h-full">
            <Application />
          </App>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};
export default Root;
