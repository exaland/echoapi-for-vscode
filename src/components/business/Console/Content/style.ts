import { Flex } from 'antd';

import styled from 'styled-components';

export const ConsoleContentWrapper = styled.div`
  width: 100%;
`;

export const LabelContainer = styled.div`
  margin-bottom: var(--margin8);

  .text {
    font-size: 14px;
    color: var(--font-title-color);

    &:hover {
      color: var(--color-primary);
    }
  }

  .label-right {
    flex-shrink: 0;
    margin-left: 30px;

    .cons-response-title {
      font-size: 12px;
      color: var(--font-content-color);
    }

    .cons-response-code {
      color: #3cc071;
    }
  }

  .cons-time {
    /* width: 58px; */
    display: flex;
    flex-shrink: 0;
    align-items: center;
    font-size: 14px;
    color: var(--font-light-color);
  }
`;

export const ChildrenContainer = styled.div`
  padding-left: 16px;

  .child-text {
    font-size: var(--font-size-14);
    color: var(--font-title-color);
  }

  .apipost-collapse-item {
    .apipost-collapse-header {
      margin-bottom: 0;
    }
  }

  .apipost-collapse-header-text {
    font-size: 14px;
    color: var(--font-title-color);
  }
`;

export const ConsoleItemWrap = styled(Flex).attrs({
  align: 'center',
})`
  padding: 8px 12px;
  border-radius: var(--border-radius);
  border-bottom: 1px solid var(--color-border);
  color: var(--font-title-color);

  .time {
    margin-right: 32px;
    color: var(--font-light-color);
  }

  .console-item-content {
    padding: 0 8px;
    border-right: 1px solid var(--color-border);
    word-break: break-all;

    &:last-of-type {
      border-right: none;
    }
  }

  &.error {
    background-color: rgb(255 88 62 / 10%);

    .anticon {
      color: #ff583e;
    }
  }

  &.warn {
    background-color: rgb(255 192 30 / 10%);

    .anticon {
      color: #ff8a00;
    }
  }
`;
