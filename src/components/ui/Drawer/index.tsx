import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';

import useTheme from '@/hooks/useTheme';

import IconFont from '../IconFont';

const defaultProps = {
  width: 1000, // default width
  keyboard: false, // default not supporting keyboard esc close
  maskClosable: false, // default clicking mask does not close
};

const CustomDrawer = (props: DrawerProps) => {
  const { themeToken } = useTheme();

  const defaultStyles = {
    body: {
      padding: themeToken.padding16,
    },
  };

  const drawerProps: DrawerProps = {
    ...defaultProps,
    closeIcon: <IconFont type="icon-close" style={{ color: themeToken.iconColor }} />,
    styles: {
      ...props.styles,
      body: {
        ...defaultStyles.body,
        ...props.styles?.body,
      },
      header: {
        height: 50,
      },
    },
    ...props,
  };

  return <Drawer {...drawerProps} />;
};

export { Drawer };

export default CustomDrawer;
