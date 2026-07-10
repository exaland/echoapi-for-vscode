import { Flex } from 'antd';

import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const FlexSegmented = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;

  .custom-segmented-tabs-wrap {
    padding-top: 12px;

    .segmented-tabs-header {
      padding: 0 16px;
    }
  }
`;


export const ApiDebugContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-right);
  padding-top: 12px;
  overflow: auto;
  > header {
    padding: 0 16px;
    .beautify-btn{
      height: 32px;
      width: 70px;
    }
  }

  > main {
    flex: 1;
    height: 0;
  }
`;

export const ApiDesignContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-right);
  padding-top: 12px;
  overflow: hidden;
  > header {
    padding: 0 16px;
    .beautify-btn{
      height: 32px;
      width: 70px;
    }
  }

  > main {
    flex: 1;
  }
  .resizable-panel-right-wrap{
    &>div {
      height: 100%;
    overflow: hidden;
    }
    .beautify-tabs-content-holder{
      height: 100%;
      background: white;
    }
  }
`;

export const SaveDropDownContainer = styled.div`
  padding: 8px;
  padding-right: 0;
  width: 200px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--popover-select-bg-color);
  box-shadow:
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);

  .apipost-tree {
    width: 100%;
    background-color: var(--popover-select-bg-color);

    .apipost-tree-list {
      padding-right: 12px;
    }

    .apipost-tree-node-content-wrapper {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 0;
      height: 100%;

      .apipost-tree-title {
        display: flex;
        width: 100%;

        .dropdown-tree-title {
          width: 100%;
          ${ellipsisStyle}
        }
      }
    }
  }
`;