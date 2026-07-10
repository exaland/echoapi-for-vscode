
export const generateToken = (antdThemeConfig: { token: Partial<GlobalThemeToken> }) => ({
  ...antdThemeConfig.token,
  // Partial overrides
  colorText: antdThemeConfig.token.fontContentColor,
  colorBgElevated: antdThemeConfig.token.colorBgRight,
  colorBorderSecondary: antdThemeConfig.token.colorBorder,
  colorSplit: antdThemeConfig.token.colorBorder,
  colorTextHeading: antdThemeConfig.token.fontTitleColor,
  fontSizeHeading3: (antdThemeConfig.token.fontSize || 12) * (3 / 2),
  colorLink: antdThemeConfig.token.colorPrimary,
  colorTextQuaternary: antdThemeConfig.token.fontLightColor,
});
