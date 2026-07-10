import React from 'react';

import { List } from 'antd';

import { useMount, useSafeState } from 'ahooks';
import classnames from 'classnames';

import useTheme from '@/hooks/useTheme';

import RowItem from './RowItem';
import { RowItemTipsConfig } from './types';

import { FlowResponseWrap } from './style';

interface Props {
  data: any;
  onItemClick?: (item: any) => void;
  renderTitle?: (data: any) => React.ReactNode;
  customTipsContent?: (data: any) => RowItemTipsConfig;
}
const FlowResponse = (props: Props) => {
  const { themeToken } = useTheme();
  const { data, renderTitle, onItemClick, customTipsContent } = props || {};
  const [active, setActive] = useSafeState<string>();
  useMount(() => {
    onItemClick?.(data?.[0]);
  });
  return (
    <FlowResponseWrap $token={themeToken}>
      <List
        size="small"
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item
            key={item.id}
            className={classnames({
              active: active === item.id,
            })}
            onClick={() => {
              setActive(item.id);
              onItemClick?.(item);
            }}
          >
            <RowItem data={item} renderTitle={renderTitle} customTipsContent={customTipsContent} />
          </List.Item>
        )}
      />
    </FlowResponseWrap>
  );
};

export default FlowResponse;
