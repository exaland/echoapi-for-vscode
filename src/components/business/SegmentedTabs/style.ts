import { Flex } from 'antd';

import styled from 'styled-components';

export const SegmentedTabsContainer = styled(Flex)<{ $token: Partial<GlobalThemeToken> }>`
  width: 100%;
  height: 100%;
  overflow: auto;

  .segmented-tabs-header {
    margin-bottom: 12px;
    width: 100%;

    .tab-bar-extra-content-wrap {
      flex: 1;
      overflow: hidden;
    }
  }

  .segmented-tabs-content {
    flex: 1;
    min-height: 400px;

    /* overflow-y: auto; */

    &-item {
      width: 100%;
      height: 100%;
    }
  }
`;
