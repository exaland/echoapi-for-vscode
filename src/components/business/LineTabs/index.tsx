import { FC, ReactNode, useMemo } from 'react';

import { TabPaneProps, Tabs, TabsProps } from 'antd';

import { map } from 'lodash';

import HeaderCount from './HeaderCount';

import { LineTabsContainer } from './style';

type LineTabsItems = Omit<TabPaneProps, 'tab'> & {
  key: string;
  label: ReactNode;
  countParams?: {
    dataSource?: any;
    showDot?: boolean;
    customCalcFun?: (dataSource: any) => number;
  };
};

type Props = TabsProps & {
  items?: LineTabsItems[];
  wrapStyle?: any;
};

const LineTabs: FC<Props> = ({ items, wrapStyle, ...resetProps }) => {
  
  const finalItems = useMemo(() => {
    return map(items, (item) => {
      return {
        ...item,
        label: item?.countParams ? (
          <>
            <HeaderCount label={item.label} {...item.countParams} />
          </>
        ) : (
          item.label
        ),
      };
    });
  }, [items]);

  return (
    <LineTabsContainer style={{ ...wrapStyle }}>
      <Tabs items={finalItems} {...resetProps} animated={false} />
    </LineTabsContainer>
  );
};

export default LineTabs;
