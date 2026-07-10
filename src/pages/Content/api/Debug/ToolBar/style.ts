import styled from 'styled-components';

export const ToolBarContainer = styled.div`
  margin-bottom: 12px;
  padding: 0 16px;

  .generate-design-data-btn-group{
    /* border: 1px solid var(--color-table-border); */
    border-radius: 4px;
    &:hover{
       /* border: 1px solid var(--color-border); */
    }
  }
  .generate-design-data-btn{
    padding: 0 4px 0 8px;
    /* border-right: 1px solid var(--color-border); */
    &:hover{
      opacity: .8;
    }
    .icon-Generate{
      color: var(--font-light-color);
      /* background-color: rgba(127, 197, 255, 0.2); */
      /* padding: 3px; */
      border-radius: 4px;
    }
    svg{
      font-size: 10px;
      /* color: #067CED; */
    }
  }

  .share-docs-btn{
    padding: 4px 6px;
    &:hover{
      opacity: .8;
    }
    svg{
      font-size: 12px;
    }
  }

  .tab-bar-extra-content-wrap {
    /* margin-left: 6px; */
   
    .edit-wrap {
      
      .apis-title-edit {
        border-color: transparent;
        border-bottom-color: var(--color-table-border);
        font-size: var(--font-size-14);
        background: transparent;
        &:hover {
          border-bottom-color: var(--selected-border-color);
        }
      }

      .edit-description {
        padding: 0;
        font-size: var(--font-size-16);
      }
    }

    .action-wrap {
      .apipost-btn {
        padding: 0;

        .apipost-btn-icon {
          margin-inline-end: 4px;
        }
      }
    }
  }
`;