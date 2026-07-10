import { useMemo } from 'react';

import { Collapse as AntdCollapse, ConfigProvider } from 'antd';

import IconFont from '@/components/ui/IconFont';
import useTheme from '@/hooks/useTheme';

import { getTheme } from './theme';
import { CollapseProps } from './types';

import { CollapseWrapper } from './style';

const Collapse = (props: CollapseProps) => {
  const { themeToken } = useTheme();
  const {
    marginBottom = themeToken.margin12,
    borderRadius = themeToken.borderRadius,
    headerPadding = `${themeToken.padding8}px ${themeToken.padding12}px`,
    bordered = false,
    items,
    ...restProps
  } = props;

  const theme = useMemo(() => getTheme(themeToken, { headerPadding }), [themeToken, headerPadding]);

  const newItems = useMemo(() => {
    if (items) {
      return items.map((item) => {
        const style = {
          ...item.style,
          marginBottom,
          borderRadius,
          border: bordered ? `1px solid ${themeToken.colorBorder}` : 'none',
        };
        return { ...item, style };
      });
    }
  }, [items, marginBottom, themeToken, bordered, borderRadius]);

  return (
    <ConfigProvider theme={theme}>
      <CollapseWrapper $token={themeToken}>
        <AntdCollapse
          expandIcon={({ isActive }) => (
            <IconFont type="icon-arrow-down" rotate={isActive ? 0 : -90} />
          )}
          {...restProps}
          bordered={false}
          items={newItems}
          style={{ ...restProps.style }}
        />
      </CollapseWrapper>
    </ConfigProvider>
  );
};

export default Collapse;
