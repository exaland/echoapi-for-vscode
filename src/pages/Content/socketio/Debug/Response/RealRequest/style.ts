import { Flex } from 'antd';

import styled from 'styled-components';

export const RealRequestContainer = styled.div`
  height: 100%;
`;

export const RequestItem = styled(Flex).attrs({
  vertical: true,
  gap: 8,
})`
  margin-bottom: 16px;

  .content-warp {
    &.base-info-wrap {
      padding: 12px;
      border: 1px solid var(--color-border);

      .url {
        flex: 1;
        margin-left: 8px;
        word-break: break-all;
      }
    }

    .apipost-table-cell {
      word-break: break-all;
    }

    .segmented-tabs-header {
      padding: 0;
    }

    &.content-request {
      .segmented-tabs-header {
        padding: 0;
      }
    }
  }
`;

export const TabBarExtraContentWrap = styled(Flex).attrs({
  align: 'center',
})`
  margin-left: 12px;
  height: 100%;

  .title {
    font-size: var(--font-size-14);
    color: var(--font-content-color);
  }

  .content {
    margin-left: 8px;
    padding: 4px;
    border-radius: var(--border-radius);
    font-size: var(--font-size-12);
    font-weight: 500;
    color: var(--color-primary);
    background-color: var(--color-primary-opacity);
  }
`;
