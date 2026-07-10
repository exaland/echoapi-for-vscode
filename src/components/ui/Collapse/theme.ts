import { ThemeToken } from '@/hooks/useTheme';

import { CollapseProps } from './types';

export const getTheme = (
  themeToken: ThemeToken,
  { headerPadding }: { headerPadding: CollapseProps['headerPadding'] }
) => {
  return {
    components: {
      Collapse: {
        colorBorder: themeToken.colorBorder,
        contentPadding: 0,
        paddingXXS: 0,
        headerPadding,
      },
    },
  };
};
