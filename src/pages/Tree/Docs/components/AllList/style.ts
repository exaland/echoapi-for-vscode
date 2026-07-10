import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const AllListContainer = styled.div`
  margin-top: 8px;
  /* padding: 0 8px; */

  /* padding-right: 16px; */
  padding: 0 8px;
  width: 100%;
  height: 30px;
  border-radius: var(--border-radius);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    /* background-color: var(--color-bg-folder-hover); */
  }

  &.selected {
    color: var(--color-primary);
    background-color: var(--color-bg-folder-hover);
  }

  .title-wrap {
    font-size: var(--font-size-14);
    color: var(--font-content-color);

    > .anticon {
      font-size: 14px;
    }

    > .title {
      ${ellipsisStyle};
      flex: 1;
      margin-left: 8px;
      width: 0;
    }
  }

  .actions-wrap {
    > .anticon {
      ${flexStyles('row', 'center', 'center')};
      margin-right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      font-size: 14px;
      color: var(--icon-color);
      transition: all 0.3s;

      &:hover {
        background-color: var(--vscode-toolbar-hoverBackground);
      }

      &:last-of-type {
        margin: 0;
      }
    }
  }
`;
