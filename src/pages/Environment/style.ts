import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';
import { hexToRGBA } from '@/utils/common';

export const EnvironmentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background:var(--color-bg-right);
  .env-menu-top {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
    border-right: 1px solid var(--color-table-border);
    .apipost-menu {
      border-inline-end: none;
    }
  }

  .title {
    ${flexStyles('row', 'center', 'flex-start')}
    font-size: 16px;
    line-height: normal;
    font-weight: 400;
    color: var(--font-title-color);
    font-style: normal;
  }

  .tip {
    padding: 8px 16px;
    width: 100%;
    ${flexStyles('row', 'center', 'flex-start')}
    font-size: 12px;
    font-weight: 400;
    color: var(--font-content-color);
    background-color: var(--color-bg-page);
    border-radius: 4px;
  }

  .column {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Render = styled.div`
  padding: 20px 20px;
  width: 100%;
  height: 100%;
`;

export const EnvLabel = styled.div`
  ${flexStyles('row', 'center', 'space-between')}

  .operation {
    visibility: hidden;
    color: var(--icon-color);

    .anticon {
      &:hover {
        color: var(--color-primary);
      }

      &:last-child {
        margin-inline-start: 10px;
      }
    }
  }

  &:hover {
    .operation {
      visibility: visible;
    }
  }

  .name {
    width: auto;
    ${ellipsisStyle}
  }

  .private {
    ${flexStyles('row', 'center', 'center')}
    padding: 2px;

    /* width: 16px; */
    height: 16px;
    border-radius: 2px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    color: #22c55e;
    background-color: ${hexToRGBA('#22C55E', 0.1)};
  }
`;

export const LeftMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 16px;
  border-radius: 4px 0 0 4px;
  padding-right: 0;
  /* background-color: var(--color-bg-page); */

  .apipost-menu-item {
    display: flex;
    align-items: center;

    .apipost-menu-title-content {
      flex: 1;
    }
  }

  .env-menu-new {
    background-color: transparent;
  }
`;

export const MenuTitle = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--font-light-color);
  font-style: normal;
`;

export const MenuChildTitle = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--font-content-color);
`;

export const MenuIconContainer = styled.span`
  .icon-cookie,
  .icon-global-param,
  .icon-global-var {
    ${flexStyles('row', 'center', 'center')}
    display: flex;
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }

  .icon-cookie {
    background-color: ${hexToRGBA('#FF8C00', 0.1)};

    > .anticon {
      color: #ff8c00;
    }
  }

  .icon-global-param {
    background-color: ${hexToRGBA('#22A2FF', 0.1)};

    > .anticon {
      color: #22a2ff;
    }
  }

  .icon-global-var {
    background-color: ${hexToRGBA('#AF71FF1A', 0.1)};

    > .anticon {
      color: #b071ff;
    }
  }
`;

export const EnvIconContainer = styled.div`
  display: flex;
  text-transform: uppercase;
  justify-content: center;
  align-items: center;
  padding: 1.8px;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  font-size: var(--font-size-12) !important;
  line-height: 18px !important;
  font-weight: 500;
  color: #067ced !important;
  background-color: ${hexToRGBA('#7fc5ff', 0.2)};
  box-sizing: border-box;
`;
