import * as vscode from 'vscode';
import i18next from "i18next";
interface GlobalConfigType {
  openedPanels:{ [key: string]: vscode.WebviewPanel };
  openedFolderTestPanels:{ [key: string]: vscode.WebviewPanel };
  openedFolderTestReportDataPanels:{ [key: string]: vscode.WebviewPanel };
  sidePanelWebView:vscode.WebviewPanel | null;
  environmentWebView:vscode.WebviewPanel | null;
  loginWebView:vscode.WebviewPanel | null;
  pushWebView:vscode.WebviewPanel | null;
  curlWebView:vscode.WebviewPanel | null;
  importDataWebView:vscode.WebviewPanel | null;
  exportDataWebView:vscode.WebviewPanel | null;
  shareListWebView:vscode.WebviewPanel | null;
  openedDocPanels:{ [key: string]: vscode.WebviewPanel };
}

interface WebsocketStoreType {
  [target_id:string]:any;
}

enum PanelNameEnum {
  EXPORTDATA = 'EXPORTDATA',
  IMPORTDATA = 'IMPORTDATA',
  SHARELIST = 'SHARELIST',
  DESIGN = 'DESIGN',
  PUSH = 'PUSH',
  LOGIN = 'LOGIN',
  ENVIRONMENT = 'ENVIRONMENT',
  SIDEPANEL = 'SIDEPANEL',
  FOLDER_TEST_REPORT= 'FOLDER_TEST_REPORT',
  FOLDER_TEST = 'FOLDER_TEST',
  OPEN = 'OPEN'
}

type PanelOptionsType = {
  [name in PanelNameEnum]: {
    viewType: string;
    title: string;
    iconName: string;
    iconObj?:any
  };
};

export const globalConfig:GlobalConfigType = {
  // Global store for open tabs
  openedPanels : {}, 

  // Global store for open folder test pages
  openedFolderTestPanels:{},

  // Global store for open folder report detail pages
  openedFolderTestReportDataPanels:{},

  // Sidebar webview object
  sidePanelWebView : null,
  // Global parameters webview object
  environmentWebView : null,
  // Login page webview object
  loginWebView : null,
  // Push data webview object
  pushWebView : null,
  // cURL import webview object
  curlWebView : null,
  // Share list webview object
  shareListWebView : null,

  // Import data webview object
  importDataWebView:null,
  
  exportDataWebView:null,
  // Global store for open document pages
  openedDocPanels:{},
};

export const websocketStore:WebsocketStoreType = {

};

export const socketIoStore:WebsocketStoreType = {

};
export const DEFAULT_TARGET_NAME:any = {
  api:'HTTP Request',
  sse:'SSE Request',
  folder:'Folder',
  websocket2:'WebSocket Client',
  socketio:'Socket.IO Client',
  graphql:'GraphQL Request',
};

export const PANEL_OPTIONS:PanelOptionsType = {
  [PanelNameEnum.EXPORTDATA]: {
    viewType: 'exportDataPanel',
    title: i18next.t('settings.export_project.title'),
    iconName: 'export_data.png'
  },
  [PanelNameEnum.IMPORTDATA]: {
    viewType: 'importDataPanel',
    title: i18next.t('common.import_project'),
    iconName: 'import_data.png'
  },
  [PanelNameEnum.SHARELIST]: {
    viewType: 'shareListPanel',
    title: i18next.t('docs.share_modal.share_list'),
    iconName: 'share_list.png'
  },
  [PanelNameEnum.DESIGN]: {
    viewType: 'designPanel',
    title: 'Design',
    iconName: 'doc.png'
  },
  [PanelNameEnum.PUSH]: {
    viewType: 'pushPanel',
    title: i18next.t('common.push_to_echoapi'),
    iconName: 'push.png'
  },
  [PanelNameEnum.LOGIN]: {
    viewType: 'loginPanel',
    title: i18next.t('common.manage_account'),
    iconName: 'login.png'
  },
  [PanelNameEnum.ENVIRONMENT]: {
    viewType: 'environmentPanel',
    title:  i18next.t('common.env_title'),
    iconName: 'setting.png'
  },
  [PanelNameEnum.SIDEPANEL]: {
    viewType: 'sidePanel',
    title: 'sidePanel',
    iconName: 'sidePanel.png'
  },
  [PanelNameEnum.FOLDER_TEST_REPORT]: {
    viewType: 'folderTestReportPanel',
    title: i18next.t('common.target_type.test_report'),
    iconName: 'test.png'
  },
  [PanelNameEnum.FOLDER_TEST]: {
    viewType: 'folderTestPanel',
    title: 'Test',
    iconName: 'test.png'
  },
  [PanelNameEnum.OPEN]: {
    viewType: 'tagPanel',
    title: 'New Request',
    iconName: '',
    iconObj:{
      sse:'sse.png',
      api:'http.png',
      websocket2:'websocket.png',
      socketio:'socketio.png',
      graphql:'graphql.png'
    }
  }
}

export const LOCAL_PORT = '8080';