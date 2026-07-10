import { ellipsisStyle, flexStyles } from '@/assets/css/style';
import { API_METHODS_COLOR } from '@/constants/common';
import styled from 'styled-components';

export const DocsContainer = styled.div`
display: flex;
flex-direction: column;
  height: 100%;
  .response-empty-wrap {
    .apipost-empty-image {
      margin-bottom: 16px;

      .icon-empty-wrap {
        font-size: 80px;
        color: var(--vscode-settings-headerBorder);
      }
    }
  }
  .beautify-spin-nested-loading{
    flex:1;
    .beautify-spin-container{
      height:100%;
    }
  }
`;

export const DocListContainer = styled.div`
display: flex;
flex-direction: column;
  flex: 1;
  gap: 4px;
  overflow-y: auto;
`;

export const ItemTitleContainer = styled.div`
  ${flexStyles('row', 'center', 'space-between')}
  padding: 5px 8px;
  overflow: hidden;

  .more-operate-wrap{
    display: none;
    margin-left: 4px;
  }

  &:hover {
    .more-operate-wrap
      {
        display: block;
      }
  }

  &:hover,
  &.select-item{
  background:var(--vscode-list-hoverBackground, #303030);
  }

  .time{
    font-size: 10px;
  }
  .name{
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    flex: 1;
    overflow: hidden;
    svg{
      font-size: 14px;
    }
  }
`;

export const TreeContainer = styled.div`
  ${flexStyles('column', 'flex-start', 'flex-start')}
  width: 100%;
  height: 100%;

  .apipost-tree {
    width: 100%;

    .apipost-tree-list {
      .apipost-tree-treenode {
        align-items: center;

        /* margin: 2px 0; */
        padding: 0 8px 0 0;

        &.drag-over {
          &::before {
            border-radius: var(--border-radius);
            background-color: var(--color-primary);
          }

          .apipost-tree-drop-indicator {
            display: none;
          }
        }

        &.drag-over-gap-top {
          padding-top: 8px;
          box-sizing: border-box;
          height: auto !important;
        }

        .apipost-tree-node-content-wrapper {
          height: 100%;

          ${flexStyles('row', 'center', 'center')};
          /* line-height: 30px; */
          /* stylelint-disable-next-line selector-class-pattern */
          .apipost-tree-iconEle {
            display: inline-flex;
            align-items: center;
            margin-right: 8px;
            width: auto;

            .methods {
              width: 30px;
              font-weight: 500;
              text-align: left;
              color: ${() => API_METHODS_COLOR['default']};

              &.post {
                color: ${() => API_METHODS_COLOR['POST']};
              }

              &.get {
                color: ${() => API_METHODS_COLOR['GET']};
              }

              &.put,
              &.socket-service {
                color: ${() => API_METHODS_COLOR['PUT']};
              }

              &.socket-service {
                width: auto;
              }

              &.socket,
              &.doc {
                color: ${() => API_METHODS_COLOR['PUT']};
              }

              &.delete {
                color: ${() => API_METHODS_COLOR['DELETE']};
              }

              &.grpc,
              &.ws,
              &.patch {
                color: ${() => API_METHODS_COLOR['default']};
              }

              &.notes {
                width: auto;
                color: rgb(247 179 39 / 100%);
              }
            }
          }

          .apipost-tree-title {
            width: 100%;
          }
        }

        .apipost-tree-switcher {
          height: 100%;
          ${flexStyles('row', 'center', 'center')};
        }

        &.apipost-tree-treenode-selected {
          .apipost-tree-title .title {
            /* color: var(--color-primary); */
          }
        }

        &::before {
          height: 100%;
          border-radius: var(--border-radius);
        }

        .folder-add-operate-wrap,
        .more-operate-wrap {
          font-size: var(--font-size-12);
          color: var(--font-light-color);
        }

        &:hover {
          .more-operate-wrap,
          .folder-add-operate-wrap,
          .node-item-del {
            display: block;
          }
        }
      }

      .tree-bottom-node-wrap,
      .tree-top-node-wrap {
        padding-right: 0;

        &:hover::before {
          background-color: transparent;
        }

        .apipost-tree-switcher {
          display: none;
        }

        .apipost-tree-node-content-wrapper {
          padding: 0;
          width: 100%;
          cursor: default;

          /* stylelint-disable-next-line selector-class-pattern */
          .apipost-tree-iconEle {
            display: none;
          }
        }
      }
    }
  }

  .root-context-menu-holder-placeholder {
    flex: 1;
    width: 100%;
  }
`;