import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { App as AntdApp, ConfigProvider, Skeleton } from "antd";
import useGlobalTheme from "@/theme";
import enUS from "antd/locale/en_US";

import "@/assets/css/reset.css";

import "@/locale";
import Login from "@/pages/Login";
import { ThemeProvider } from "styled-components";
import GlobalThemeStyle from "../theme/global";
import GlobalStyle from "../theme/globalStyle";
import { useSystemConfig, useUserConfig } from "@/store";

function LoginPanel() {
  const customTheme = useGlobalTheme();

  const updateUserConfig = useUserConfig((store) => store.updateUserConfig);
  const [lodaing, setLodaing] = useState(true);
  useEffect(() => {
    // Get global configuration
    window?.vscode.postMessage({
      action: "getSystemConfig",
    });

    window?.vscode.postMessage({
      action: "getUserConfig",
    });
  }, []);

  useEffect(() => {
    const messageHandler = async (event: { data: any }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case "setUserConfig":
          updateUserConfig({ ...message.data });
          setLodaing(false);
          break;
        case "setSystemConfig":
          const { systemConfig, updateSystemConfig } =
            useSystemConfig.getState();

          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
      }
    };
    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  return (
    <ConfigProvider
      prefixCls={"beautify"}
      theme={{
        token: customTheme.token,
        components: customTheme.components,
      }}
      locale={enUS}
    >
      <AntdApp>
        <ThemeProvider theme={customTheme}>
          <GlobalThemeStyle />
          <GlobalStyle />
          <Skeleton
            active
            paragraph={{ rows: 15, width: "100%" }}
            loading={lodaing}
          >
            <Login />
          </Skeleton>
        </ThemeProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<LoginPanel />);
