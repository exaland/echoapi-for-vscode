import styled from 'styled-components';

export const LinkWarper = styled.div`
  width: 100%;

  .tree-panel {
    margin-top: 12px;
    min-height: 360px;
    max-height: 360px;
    background-color: transparent;

    .apipost-tree-node-selected {
      /* color: red; */
      background-color: var(--color-bg-page);
    }

    .model-node-item {
      display: flex;
      flex-direction: row;

      .icon-panel {
        padding: 0 5px;

        .icon-model {
          padding: 0 3px 0 8px;
          color: #30d4ad;
        }
      }

      .node-text {
        flex: 1;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .empty-list {
    margin-top: 12px;
    height: 404px;
    text-align: center;
    box-sizing: border-box;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    width: 60px;
    height: 32px;
  }
`;
