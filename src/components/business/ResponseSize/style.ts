import { Flex } from 'antd';

import styled from 'styled-components';

import { hexToRGBA } from '@/utils/common';

export const CustomPopoverWrap = styled.div`
  .response-size-title {
    color: var(--font-pale-color);
  }

  .new-response-size-title {
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--font-title-color);
  }

  .time {
    /* color: var(--color-success); */
  }

  .progress {
    position: relative;
    width: 100%;
    height: 26px;

    &-left,
    &-right {
      position: absolute;
      top: 0;
      z-index: 1;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
    }

    &-content {
      position: relative;
      z-index: 2;
      margin-top: 4px;
      height: 22px;
      background: #ffb400;
      box-sizing: border-box;

      &.download {
        background: #26cea4;
      }

      &.tcpHandshake,
      &.sslHandshake {
        background: #2d99ff;
      }

      &.waiting {
        border: 1px dashed #fe5a41;
        background: rgb(254 90 65 / 10%);
      }
    }
  }

  .apipost-row {
    &.prepare,
    &.process,
    &.empty {
      color: var(--font-pale-color);

      .progress-content {
        background: var(--check-box-border-color);
      }
    }
  }
`;

export const CustomProxyWrap = styled(Flex)`
  .desc {
    font-size: 12px;
    color: var(--font-pale-color);

    > span {
      display: inline-flex;
      width: 50%;
      word-break: break-all;
      word-wrap: break-word;

      &:last-child {
        justify-content: flex-end;
        text-align: right;
      }
    }
  }

  .name {
    font-size: 12px;
    color: var(--font-title-color);
  }

  .icon-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 16px;
    height: 16px;

    .anticon {
      font-size: 14px;
    }
  }

  .right-wrapper {
    > .apipost-flex {
      width: 100%;
    }
  }
`;

export const CustomCodePopoverWrap = styled(Flex)`
  .desc {
    font-size: 12px;
    color: var(--font-pale-color);
  }

  .name {
    font-size: 12px;
    color: var(--font-title-color);
  }

  .icon-code {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${hexToRGBA('#ff583e', 0.1)};

    .anticon {
      color: #ff583e;
    }

    &.success {
      background-color: ${hexToRGBA('#26CEA4', 0.1)};

      .anticon {
        color: #26cea4;
      }
    }
  }
`;

export const CustomSizePopoverWrap = styled(Flex)`
  .desc {
    font-size: 12px;
    color: var(--font-pale-color);
  }

  .name {
    font-size: 12px;
    color: var(--font-title-color);
  }

  .icon-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 16px;
    height: 16px;
    border-radius: 2px;
    background-color: rgb(33 144 255 / 15%);

    .anticon {
      color: var(--color-info);
    }

    &.request {
      background-color: rgb(255 199 0 / 15%);

      .anticon {
        color: var(--color-warning);
      }
    }
  }
`;

export const ResponseSizeWrap = styled(Flex)`
  font-size: var(--font-size-14);
  color: var(--font-pale-color);

  span {
    /* color: var(--color-success); */

    &.error {
      color: var(--color-error);
    }
  }

  .cur-pointer {
    cursor: pointer;
  }
`;
