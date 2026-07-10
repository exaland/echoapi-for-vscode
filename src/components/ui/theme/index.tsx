import { theme } from 'antd';

const { useToken } = theme;
const useTheme = (): { themeToken: Partial<GlobalThemeToken> } => {
  const { token } = useToken();
  return {
    themeToken: token,
  };
};

export default useTheme;
