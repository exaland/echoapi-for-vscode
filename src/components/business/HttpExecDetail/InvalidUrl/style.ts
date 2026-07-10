import { Flex } from 'antd';

import styled from 'styled-components';

import { hexToRGBA } from '@/utils/common';

export const InvalidUrlWrapper = styled(Flex)`
  width: 100%;
  height: 100%;

  .icon {
    font-size: 58px;
    color: var(--icon-color);
  }

  .text {
    padding: 4px 8px;
    border-radius: var(--border-radius);
    text-align: center;
    color: #fe5a41;
    background-color: ${hexToRGBA('#fe5a41', 0.1)};
    word-break: break-all;
  }
`;
