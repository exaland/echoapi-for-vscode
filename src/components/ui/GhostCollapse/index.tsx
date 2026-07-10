import { useMemo } from 'react';

import type { CollapseProps as AntdCollapseProps } from 'antd';
import { Collapse as AntdCollapse, ConfigProvider } from 'antd';

import classNames from 'classnames';

import IconFont from '@/components/ui/IconFont';
import useTheme from '@/hooks/useTheme';

import { getTheme } from './theme';

import { GhostCollapseWrapper } from './style';

type GhostCollapseProps = AntdCollapseProps & {
  /**whether header spacing follows content width */
  fitContent?: boolean;
};

const GhostCollapse = ({ fitContent = true, ...restProps }: GhostCollapseProps) => {
  const { themeToken } = useTheme();
  const theme = useMemo(() => getTheme(), []);

  return (
    <ConfigProvider theme={theme}>
      <GhostCollapseWrapper $token={themeToken}>
        <AntdCollapse
          rootClassName={classNames({ 'fit-content': fitContent })}
          expandIcon={({ isActive }) => (
            <IconFont
              type="icon-arrow-down"
              style={{ color: themeToken.iconColor }}
              rotate={isActive ? 0 : -90}
            />
          )}
          expandIconPosition="end"
          ghost
          {...restProps}
        />
      </GhostCollapseWrapper>
    </ConfigProvider>
  );
};

export default GhostCollapse;
