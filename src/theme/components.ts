import { ThemeConfig } from 'antd';

export const generateComponents = (antdThemeConfig: {
  token: Partial<GlobalThemeToken>;
}): ThemeConfig['components'] => ({
  App: {
    fontSize: antdThemeConfig.token.fontSize14,
  },
  Input: {
    colorBorder: 'transparent',
    fontSize: antdThemeConfig.token.fontSize14,
    colorTextDescription: antdThemeConfig.token.fontContentColor,
    colorBgContainer: 'transparent',
    lineHeight: 1,
    colorTextPlaceholder: 'var(--vscode-input-placeholderForeground)',
    paddingBlock: 6.5,
  },
  InputNumber: {
    colorBorder: antdThemeConfig.token.tableColorBorder,
    colorTextDescription: antdThemeConfig.token.fontContentColor,
    colorBgContainer: 'transparent',
    colorTextPlaceholder: 'var(--vscode-input-placeholderForeground)',
  },
  Checkbox: {
    colorBgContainer: antdThemeConfig.token.colorBgRight,
    colorBorder: antdThemeConfig.token.checkBoxBorderColor,
  },

  Button: {
    defaultBg: 'transparent',
    defaultBorderColor: antdThemeConfig.token.colorDashed,
    colorText: antdThemeConfig.token.fontContentColor,
    textHoverBg: 'transparent',
    defaultHoverBg: 'transparent',
    defaultActiveBg: 'transparent',
    defaultGhostBorderColor: antdThemeConfig.token.colorDashed,
    defaultGhostColor: antdThemeConfig.token.fontContentColor,
    colorLink: antdThemeConfig.token.colorPrimary,
    colorLinkActive: antdThemeConfig.token.fontTitleColor,
    colorLinkHover: antdThemeConfig.token.SelectedBorderColor,
    lineHeight: 1,
  },
  List: {
    avatarMarginRight: 12,
    itemPadding: '12px',
  },
  Divider: {
    colorSplit: antdThemeConfig.token.dividerColor,
    marginLG: 16,
  },
  Empty: {
    colorText: antdThemeConfig.token.fontLightColor,
    fontSize: antdThemeConfig.token.fontSize14,
    lineHeight: 1.4,
    controlHeightLG: 30,
  },
  Badge: {
    dotSize: 8,
    boxShadow: 'none',
  },
  Collapse: {
    headerPadding: '14px 16px',
  },
  Segmented: {
    itemColor: 'var(--vscode-foreground)',
    itemActiveBg: 'none',
    itemHoverBg: 'none',
    itemHoverColor: antdThemeConfig.token.fontContentColor,
    itemSelectedBg: 'transparent',
    itemSelectedColor: antdThemeConfig.token.fontTitleColor,
    colorBgLayout: antdThemeConfig.token.colorBgPage,
  },
  Tree: {
    colorBgContainer: antdThemeConfig.token.colorBgPage,
    controlItemBgHover: antdThemeConfig.token.colorBgFolderHover,
    colorText: antdThemeConfig.token.fontContentColor,
    directoryNodeSelectedBg: antdThemeConfig.token.colorBgFolderHover,
    fontSize: antdThemeConfig.token.fontSize14,
    directoryNodeSelectedColor: antdThemeConfig.token.fontContentColor,
  },
  Layout: {
    bodyBg: antdThemeConfig.token.colorBgRight,
    headerBg: antdThemeConfig.token.colorBgRight,
    headerPadding: 0,
  },
  Typography: {
    lineHeight: 1.4,
    fontSize: antdThemeConfig.token.fontSize14,
    colorText: antdThemeConfig.token.fontContentColor,
  },
  Select: {
    selectorBg: 'var(--vscode-input-background)',
    colorBorder: 'transparent',
    optionSelectedBg: antdThemeConfig.token.popoverSelectBgHoverColor,
    optionSelectedColor: 'var(--vscode-foreground)',
    colorTextPlaceholder:'var(--vscode-input-placeholderForeground)',
    optionSelectedFontWeight: '400',
    fontSize: antdThemeConfig.token.fontSize14,
    padding: 0,
    boxShadow: 'none',
    colorBgElevated: antdThemeConfig.token.popoverSelectBgColor,
    multipleItemBg: antdThemeConfig.token.colorBgGray,
    colorIcon: antdThemeConfig.token.iconColor,
  },

  Table: {
    borderColor: antdThemeConfig.token.tableColorBorder,
    fontSize: antdThemeConfig.token.fontSize14,
    fontWeightStrong: 400,
  },
  Tabs: {
    cardHeight: 30,
    horizontalItemGutter: 8,
    cardPaddingSM: '6px 14px',
    horizontalMargin: '0 0 12px 0',
    horizontalItemPadding: '12px 8px',
    fontSize: antdThemeConfig.token.fontSize14,
    itemSelectedColor: antdThemeConfig.token.fontTitleColor,
  },
  Progress: {
    marginXS: 0,
    circleTextFontSize: `${antdThemeConfig.token.fontSize14}px`,
    defaultColor:antdThemeConfig.token.colorBgFolderHover,
    remainingColor:antdThemeConfig.token.tableHeaderBgColor,
  },
  Statistic: {
    titleFontSize: antdThemeConfig.token.fontSize14,
    fontSize: 20,
    colorTextDescription: antdThemeConfig.token.fontLightColor,
  },
  Menu: {
    itemSelectedBg: antdThemeConfig.token.popoverSelectBgHoverColor,
    itemHoverBg: antdThemeConfig.token.popoverSelectBgHoverColor,
    itemHoverColor: antdThemeConfig.token.fontContentColor,
    itemBg: 'transparent',
    subMenuItemBg: 'transparent',
    itemActiveBg: antdThemeConfig.token.popoverSelectBgHoverColor,
    fontSize: antdThemeConfig.token.fontSize14,
  },
  Dropdown: {
    colorBgElevated: antdThemeConfig.token.popoverSelectBgColor,
    controlItemBgHover: antdThemeConfig.token.popoverSelectBgHoverColor,
    controlItemBgActive: antdThemeConfig.token.popoverSelectBgHoverColor,
    controlItemBgActiveHover: antdThemeConfig.token.popoverSelectBgHoverColor,
    controlPaddingHorizontal:8,
    paddingXS: 2,
    paddingXXS: 2
  },
  Drawer: {
    colorBgElevated: antdThemeConfig.token.modalContentBg,
    colorIcon: antdThemeConfig.token.iconColor,
  },
  Popover: {
    colorBgElevated: antdThemeConfig.token.popoverSelectBgColor,
  },
  Card: {
    colorBgContainer: antdThemeConfig.token.colorBgRight,
    colorBorderSecondary: antdThemeConfig.token.colorBorder,
  },
  Descriptions: {
    colorTextTertiary: antdThemeConfig.token.fontLightColor,
    itemPaddingBottom: antdThemeConfig.token.padding12,
  },
  Modal: {
    contentBg: antdThemeConfig.token.modalContentBg,
    headerBg: antdThemeConfig.token.modalContentBg,
    colorBgMask: antdThemeConfig.token.modalMaskBg,
    titleFontSize: antdThemeConfig.token.fontSize16,
    colorIcon: antdThemeConfig.token.fontTitleColor,
    fontSize: antdThemeConfig.token.fontSize14,
    borderRadiusLG: 8,
  },
  Form: {
    itemMarginBottom: 20,
    verticalLabelPadding: '0 0 12px 0',
    fontSize: antdThemeConfig.token.fontSize14,
    labelColor:antdThemeConfig.token.fontContentColor,
  },
  Pagination: {
    fontSize: antdThemeConfig.token.fontSize14,
    itemActiveBg: 'transparent',
  },
  TreeSelect: {
    nodeHoverBg: antdThemeConfig.token.popoverSelectBgHoverColor,
    nodeSelectedBg: antdThemeConfig.token.popoverSelectBgHoverColor,
    colorBgElevated: antdThemeConfig.token.popoverSelectBgColor,
    fontSize: antdThemeConfig.token.fontSize14,
  },
  DatePicker: {
    colorBgElevated: antdThemeConfig.token.popoverSelectBgColor,
    colorIcon: antdThemeConfig.token.iconColor,
  },
  Transfer: {
    itemHeight: 40,
    headerHeight: 32,
    fontSize: antdThemeConfig.token.fontSize14,
    controlItemBgActive: antdThemeConfig.token.tableHeaderBgColor,
    controlItemBgActiveHover: antdThemeConfig.token.tableHeaderBgColor,
    controlItemBgHover: antdThemeConfig.token.tableHeaderBgColor,
  },
  Radio: {
    colorBorder: antdThemeConfig.token.checkBoxBorderColor,
    buttonBg:'transparent',
    buttonCheckedBg:'transparent'
  },
  Tooltip:{
    colorBgSpotlight:'var(--vscode-dropdown-listBackground, var(--vscode-settings-dropdownBackground))',
    colorTextLightSolid:antdThemeConfig.token.fontContentColor,
  }
});
