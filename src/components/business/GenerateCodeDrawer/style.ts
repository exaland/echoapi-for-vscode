import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';
import IconFont from '@/components/ui/IconFont';

export const GenerateCodeWrap = styled.div`
  height: 100%;

  .apipost-spin-nested-loading {
    height: 100%;

    .apipost-spin-container {
      height: 100%;

      > .apipost-flex {
        height: 100%;
      }
    }
  }

  .menu {
    padding: 16px 8px;
    width: 212px;
    min-width: 212px;
    max-height: 100%;
    overflow: auto;
    border-right: 1px solid var(--color-border);
    overflow-y: auto;
    color: var(--font-content-color);
    background-color: var(--color-bg-page);

    &-item {
      ${flexStyles('row', 'center', 'flex-start')}
      margin-bottom: 4px;
      padding: 0 8px;
      height: 32px;
      border-radius: var(--border-radius);
      cursor: pointer;

      &:hover,
      &.active {
        /* color: var(--color-primary); */
        background-color: var(--vscode-list-inactiveSelectionBackground);
      }
    }
  }

  .edit {
    flex: 1;
    height: 100%;
    white-space: pre-wrap;
    overflow-x: auto;
  }
`;

export const LanguagesIcon = styled(IconFont)`
  margin-right: 8px;
  font-size: var(--font-size-16);
`;
