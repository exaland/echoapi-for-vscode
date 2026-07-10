import { globalConfig, LOCAL_PORT, PANEL_OPTIONS } from "../constants";
import { handleMessage } from "../messageHandler/sidbar";
import * as vscode from "vscode";
import path from "path";
import { getApiList, getHtmlForWebview } from "../utils";

class MySidebarView {
  context: any;
  constructor(context: any) {
    this.context = context;
  }

  resolveWebviewView(webviewView: any) {
    const panelOptions = PANEL_OPTIONS.SIDEPANEL;

    webviewView.webview.options = {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [this.context.extensionUri],
    };

    // Receive messages from Webview
    webviewView.webview.onDidReceiveMessage(
      async (message: { action: string; data: any }) => {
        handleMessage(message, this.context);
      },
    );

    try {
      let scriptUri = webviewView.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(
            this.context.extensionPath,
            "dist",
            `${panelOptions.viewType}.js`,
          ),
        ),
      );
      if (process?.env?.NODE_ENV === "development") {
        scriptUri = `http://localhost:${LOCAL_PORT}/${panelOptions.viewType}.bundle.js`;
      }

      const resourceBaseUrl = webviewView.webview.asWebviewUri(
        vscode.Uri.file(path.join(this.context.extensionPath, "dist")),
      );
      webviewView.webview.html = getHtmlForWebview(
        scriptUri,
        resourceBaseUrl,
        null,
      );
    } catch (error) {}

    // Listen for Webview view visibility changes
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        // Pass apiList after display
        webviewView.webview.postMessage({
          action: "setApiList",
          data: getApiList(this.context),
        });
        // Pass userConfig after display
        let user_config: any = this.context.globalState.get("userConfig") || {};
        webviewView.webview.postMessage({
          action: "setUserConfig",
          data: user_config,
        });
      }
    });

    // Triggered when tab is closed
    webviewView.onDidDispose(
      () => {
        globalConfig.sidePanelWebView = null;
        // When the panel is closed, cancel any future updates to the webview content
      },
      null,
      this.context.subscriptions,
    );
    globalConfig.sidePanelWebView = webviewView;
  }
}

export default MySidebarView;
