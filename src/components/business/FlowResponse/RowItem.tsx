import React from 'react';

import { Flex } from 'antd';

import classNames from 'classnames';
import { includes, isEqual } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { sizeFormat } from '@/utils/common';

import WsIcon from './Icon';
import { RowItemTipsConfig } from './types';

interface Props {
  data: any;
  renderTitle?: (data: any) => React.ReactNode;
  customTipsContent?: (data: any) => RowItemTipsConfig;
}

const RowItem = (props: Props) => {
  const { data, renderTitle, customTipsContent } = props || {};
  
  const calcTipsContent = (data: any) => {
    let config: RowItemTipsConfig = {
      size: data?.size,
      time: data?.time,
      mode: data?.mode,
    };

    if (customTipsContent) {
      config = customTipsContent?.(data);
    }

    return (
      <>
        <p>size: {sizeFormat(config?.size)}</p>
        <p>time: {config?.time}</p>
        {config?.mode && <p>Mime Type: {config?.mode}</p>}
      </>
    );
  };

  return (
    <Flex justify="space-between" style={{ width: '100%' }}>
      <Flex gap={12} align="center" style={{ maxWidth: '80%', overflow: 'hidden' }}>
        <span
          className={classNames({
            'icon-span': true,
            message: isEqual('message', data.action),
            send: isEqual('send', data.action),
          })}
        >
          <WsIcon action={data.action} />
        </span>
        {renderTitle?.(data)}
      </Flex>

      <Flex gap={12} justify="flex-end">
        {includes(['message', 'send'], data.action) && (
          <>
            <Tooltip title={calcTipsContent(data)}>
              <IconFont className="flow-icon" type="icon-tips" />
            </Tooltip>
          </>
        )}
        <span>{data?.time}</span>
      </Flex>
    </Flex>
  );
};

export default RowItem;
