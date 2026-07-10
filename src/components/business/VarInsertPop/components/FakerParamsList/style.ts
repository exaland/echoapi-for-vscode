import { Flex } from 'antd';

import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const FakerParamsContainer = styled(Flex)`
  padding: 6px;
  border-radius: 4px;
  background-color: var(--color-primary-opacity);
  box-sizing: border-box;

  .param {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 6px;
    border-radius: 4px;
    background-color: var(--popover-select-bg-color);
    box-sizing: border-box;

    &.footer {
      margin-bottom: 0;
    }

    .param-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      min-height: 28px;
      border-radius: 4px;
      gap: 4px;
      box-sizing: border-box;

      .param-item-del {
        visibility: hidden;
      }

      &:hover {
        background-color: var(--form-hover-color);

        .param-item-del {
          visibility: visible;
        }
      }

      .param-content {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 4px;
      }

      .param-item-desc {
        width: 120px;
        font-size: 14px;
        ${ellipsisStyle}
      }

      .param-item-com {
        flex: 1;
        width: 0;

        > * {
          width: 100%;
        }

        .apipost-select {
          min-width: 88px;
        }
      }
    }
  }

  .selection {
    display: flex;
    flex-wrap: wrap;

    .select-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 5px;
      min-height: 24px;
      border-radius: 4px;
      border: 1px solid transparent;
      font-size: 12px;
      font-weight: 400;
      color: var(--font-content-color);
      box-sizing: border-box;
      gap: 4px;

      &:hover {
        border: 1px solid var(--selected-border-color);
        color: var(--color-primary);
        background-color: var(--popover-select-bg-color);
        cursor: pointer;
      }
    }
  }
`;
