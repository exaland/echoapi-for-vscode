import { ThemeToken } from '@/hooks/useTheme';

export const getTheme = (themeToken: ThemeToken, { cellPadding = 8.5 }) => {
  return {
    components: {
      Table: {
        /**Table background color */
        colorBgContainer: themeToken.colorBgRight,
        /**Header background color */
        headerBg: themeToken.colorBgRight,
        /**Mouse hover background color */
        rowHoverBg: 'var(--vscode-settings-rowHoverBackground)',
        /**Cell padding */
        padding: cellPadding,
        /**Selected background color */
        rowSelectedBg: 'var(--vscode-settings-rowHoverBackground)',
        /**Selected hover background color */
        rowSelectedHoverBg: 'var(--vscode-settings-rowHoverBackground)',
        /**Header color */
        headerColor: themeToken.fontContentColor,
        /** Remove small vertical line */
        headerSplitColor: themeToken.colorBgRight,
        // Selection column width
        selectionColumnWidth: 40,
      },

      Input: {
        /**Focused background color */
        activeBorderColor: themeToken.colorPrimary,
        /**Focused shadow */
        activeShadow: 'none',
        /**borderRadius */
        borderRadius: 0,
      },
    },
  };
};
