import styled from 'styled-components';

export const TreeCheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 4px;
  .apipost-tree {
    background-color: transparent;
  }

  .tree-wrap {
    flex: 1;
    overflow: hidden;
    /* background-color: var(--search-big-select-color); */
    /* padding: 0 12px 12px 12px; */
    border-radius: 0 0 4px 4px;
    .apipost-tree-checkbox {
      align-self: center;
      margin-top: 0;
    }
    .beautify-tree-checkbox-checked{
      .beautify-tree-checkbox-inner{
        /* background-color: #835dff !important; */
        /* border-color: #835dff; */
      }
    }
    .apipost-tree-checkbox-inner{
      /* background: var(--vscode-editor-background,#121212); */
      /* border: 1px solid var(--vscode-editorWidget-border, #353535); */
    }
  }
`;
