import { theme } from 'antd';

const { useToken } = theme;

export type ThemeToken = Partial<GlobalThemeToken>;

const useTheme = (): { themeToken: Partial<GlobalThemeToken> } => {
  const { token } = useToken();

  return {
    themeToken: token,
  };
};

export default useTheme;
