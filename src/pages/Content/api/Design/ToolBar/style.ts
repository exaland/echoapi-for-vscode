import styled from 'styled-components';

export const ToolBarContainer = styled.div`
  margin-bottom: 12px;
  padding: 0 16px;
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
  .beautify-new-http-more{
    width: 100%;
    & > button:first-child{
      flex: 1;
      font-weight: 400;
    }
    & > button{
      height: 26px;
      box-shadow: none;
      &:hover{
        color: var(--color-font-light-hover) !important;
        background-color: var(--color-bg-light-hover) !important;
      }
    }
    & > button.beautify-btn-compact-last-item{
      width: 28px;
      background: var(--color-primary-opacity);
      color: var(--color-primary);
    }
    & > button.beautify-btn-compact-last-item::before{
      width: 0 !important;
    }
    & > button.beautify-btn-compact-first-item{
      background: var(--color-primary-opacity);
      color: var(--color-primary);
    }
 
  }
`;