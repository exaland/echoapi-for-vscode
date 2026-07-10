import { ellipsisStyle, flexStyles } from '@/assets/css/style';
import styled from 'styled-components';
import { API_METHODS_COLOR } from '@/constants/common';

export const TreeMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* -webkit-font-smoothing: antialiased; */
  padding: 0 10px;
  .beautify-dropdown-trigger{
  border:none !important;
  border-radius: 4px;
  &:hover{
    border-color: transparent;
  }
 }
  .help-us-improve-echoapi{
    position: fixed;
    right: 12px;
    bottom: 15px;
    width: 38px;
    height: 38px;
    background: var(--color-bg-right);
    border-radius: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-primary);
    &:hover{
      .icon-client-close{
        display: block;
      }
    }
    .icon-client-close{
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .segmented-tabs-content-item{
    /* display: flex; */
    flex-direction: column;
    /* padding-bottom: 60px; */
  }

  .tab-container.beautify-segmented{
    margin-top: 12px;
    width: 100%;
    /* background: var(--search-bg-color); */
    border-bottom: 1px solid var(--vscode-settings-headerBorder);
    border-radius: 0;
    padding-bottom: 0;
    font-size: 14px;

    .beautify-segmented-group{
      justify-content: space-around;
    }
    .beautify-segmented-item-label{
     padding: 0 4px;
    }
    .beautify-segmented-item{
    /* flex:1 ; */
    border-radius: 0;
        border-bottom: 2px solid transparent;
    }
    .beautify-segmented-item-selected{
      border-color: var(--color-primary);
      /* font-weight: 600; */
      background: transparent;
    }
  }
  .tree-node-item-title-action-wrap {
    > .mark-wrap {
      position: relative;
      width: 14px;
      height: 14px;

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #26cea4;
        content: '';
      }
    }

    > .anticon {
      font-size: 14px;
      cursor: pointer;
    }

    > .icon-archive {
      color: #ffc01e;
    }
    > .more-operate-wrap,
    > .folder-add-operate-wrap {
      /* font-size: 20px; */
      display: none;
    }
  }
  .response-empty-wrap {
    .apipost-empty-image {
      margin-bottom: 16px;

      .icon-empty-wrap {
        font-size: 80px;
        color: var(--vscode-settings-headerBorder);
      }
    }

    .apipost-empty-description {
      font-size: var(--font-size-12);
      color: var(--vscode-tab-unfocusedInactiveForeground);
      .beautify-btn{
        color: var(--color-primary);
        padding: 0;
      }
    }
  }
  
  .tree-wrap {
    flex: 1;
    margin-top: 8px;
    overflow: hidden;
    height: calc(100% - 38px);
    .apipost-tree-list-holder {
      /* padding-right: 10px; */
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


export const DefaultButtonNodeWrap = styled.div`
  margin-top: 4px;
  padding-bottom: 100px;

  .footer-add-btn {
    width: 100%;
    height: 28px;
  }
`;

export const CreateOtherIcon = styled.div`
  ${flexStyles('row', 'center', 'center')};
  width: 16px;
  height: 16px;

  .anticon {
    font-size: var(--font-size-16);
    color: var(--color-primary);
  }
`;


export const ItemTitleContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-start')}
  width: 100%;

  > .title {
    flex: 1;
    width: 0;
    ${ellipsisStyle}

    > .children-num {
      margin-left: 8px;
      font-size: var(--font-size-12);
      letter-spacing: 0.5px;
      color: var(--font-light-color);
    }
  }
`;
