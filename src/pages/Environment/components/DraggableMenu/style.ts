import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const DraggableMenuContainer = styled.ul`
  width: 240px;
  overflow: hidden;
`;

export const DraggableMenuGroupContainer = styled.li`
  .draggable-menu-item-group-title {
    padding: 8px 0;
    font-size: 14px;
    line-height: 1.4;
  }
`;

export const DraggableMenuItemContainer = styled.li`
  overflow-y: auto;

  .draggable-menu-item {
    position: relative;
    ${ellipsisStyle};
    ${flexStyles('row', 'center', 'flex-start')};
    padding-inline: 20px 10px;
    width: calc(100% - 8px);
    height: 36px;
    border-radius: var(--border-radius);
    font-size: var(--font-size-14);
    line-height: 40px;
    color: var(--font-content-color);
    margin-block: 2px;
    background-color: transparent;
    cursor: pointer;
    transition:
      border-color 0.3s,
      background-color 0.3s,
      padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    .icon-drag {
      visibility: hidden;
      position: absolute;
      left: 6px;
      color: var(--icon-color);
    }

    &-selected {
      background-color: var(--popover-select-bg-hover-color);

      .menu-item-name {
        color: var(--vscode-foreground) !important;
      }
    }

    .draggable-menu-title-content {
      margin-inline-start: 10px;
      flex: 1;
      min-width: 100px;
      color: var(--icon-color);
    }

    &:hover {
      background-color: var(--popover-select-bg-hover-color);

      .icon-drag {
        visibility: visible;
      }
    }
  }
`;
