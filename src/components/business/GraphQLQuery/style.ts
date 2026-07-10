import { Flex } from 'antd';

import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const GraphQLContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  min-height: 200px;
`;

export const MainContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-table-border);
  background-color: var(--color-bg-right);

  .monaco-wrapper {
    border-bottom: none;
  }

  .edit-header {
    padding: 0 16px;
    width: 100%;
    height: 32px;
    border-bottom: 1px solid var(--color-table-border);
  }

  .schema-loading {
    width: 100%;
    height: 100%;

    .apipost-spin-container {
      width: 100%;
      height: 100%;
    }

    .apipost-empty-description {
      font-size: 12px;
    }

    .apipost-empty-image {
      margin-bottom: 12px;
    }

    .apipost-empty-footer {
      margin-top: 12px;
    }
  }
`;

export const SchemaTreeContainer = styled.div`
  display: flex;
  flex-direction: column;

  /* padding: 12px; */
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-right);

  .search {
    padding: 12px 12px 4px;
    box-sizing: border-box;
    width: 100%;
    .beautify-input-affix-wrapper{
      background-color: var(--vscode-input-background);
      border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
    }
  }

  .schema-tree {
    flex: 1;
    width: 100%;
    height: 0;

    .apipost-tree-switcher-icon {
      color: var(--icon-color);
    }

    .apipost-tree .apipost-tree-checkbox .apipost-tree-checkbox-inner {
      border-color: var(--check-box-border-color);
      background-color: transparent;
    }

    .apipost-tree .apipost-tree-checkbox-checked .apipost-tree-checkbox-inner {
      border-color: var(--check-box-border-color);
      background-color: var(--color-primary);
    }
  }

  /* box-sizing: border-box; */

  .apipost-tree {
    /* padding: 8px 0; */
    background-color: transparent;

    .apipost-tree-list-holder {
      padding: 0 12px;
    }

    .apipost-tree-switcher {
      &:hover {
        background-color: transparent;
      }
    }

    .apipost-tree-indent-unit::before {
      border-color: var(--color-border);
    }

    .apipost-tree-switcher-leaf-line {
      &::before {
        border-color: var(--color-border);
      }

      &::after {
        border-color: var(--color-border);
      }
    }

    .apipost-tree-treenode {
      align-items: center;
      height: 32px;

      &:hover::before {
        border-radius: 4px;
        background-color: var(--form-hover-color);
      }

      &.apipost-tree-treenode-selected {
        &::before {
          border-radius: 4px;
          background-color: var(--form-hover-color);
        }
      }

      .action-outer {
        padding: 4px 8px;
        border-radius: 4px;
        box-sizing: border-box;
        word-wrap: break-word;
        background-color: var(--color-primary-opacity);

        &.primary {
          color: var(--color-primary);
        }
      }
    }
  }
`;
export const TitleRenderContainer = styled(Flex)`
  padding-right: 8px;
  gap: 8px;
  width: 100%;

  .title-container {
    flex: 1;
    width: 0;

    .input {
      ${ellipsisStyle};
      &.noDesc {
        max-width: 90%;
      }
    }

    .type {
      ${ellipsisStyle};
      max-width: 30%;
      color: #22c55e;

      &.null,
      &.array {
        color: #1787ee;
      }

      &.noDesc {
        flex: 1;
        max-width: none;
      }
    }

    .desc {
      flex: 1;
      min-width: 10%;
      ${ellipsisStyle};
      color: var(--font-light-color);
    }
  }

  /* width: 100%;
  height: 100%;
  overflow: auto; */

  /* background-color: var(--color-bg-right); */

  .apipost-badge .apipost-badge-multiple-words {
    padding: 0 4px;
  }

  .apipost-badge-count {
    box-shadow: none;
  }
`;

export const PopoverAddContainer = styled(Flex)`
  width: 330px;
  height: 410px;

  .apipost-input-affix-wrapper {
    background-color: var(--color-bg-right);
  }

  .apipost-tree {
    background-color: var(--popover-select-bg-color);
  }
`;

export const PopoverFilterContainer = styled(Flex)`
  width: 600px;
  max-height: 500px;

  .filter-remove {
    color: var(--icon-color);

    &:hover {
      color: var(--color-error);
    }
  }
`;

export const FilterContainer = styled(Flex)`
  .clear-btn {
    color: var(--font-light-color);

    &:hover {
      color: var(--font-content-color);
    }
  }
`;
