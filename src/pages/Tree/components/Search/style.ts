import { flexStyles } from '@/assets/css/style';
import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  /* height: 32px; */
  .beautify-new-http-more{
    width: 100% !important;
    & > button:first-child{
      flex: 1;
      font-weight: 600;
    }
    & > button{
      height: 28px;
    }
  }
  .apipost-flex {
    height: 100%;

    .apipost-input-affix-wrapper {
      padding: 4px 8px;
      height: 100%;
      background-color: var(--search-bg-color);

      .apipost-input-suffix {
        min-width: 80px;
      }
    }
  }
  .apipost-space-compact{
    width: auto;
  }
  .search-wrap {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 4px;
    .apipost-input {
      font-size: var(--font-size-12);
    }
    .beautify-input-outlined{
      background: var(--vscode-input-background);
    }
    .apipost-select {
      position: relative;
      right: -12px;
    }

    .apis-mark-select-wrap {
      .apipost-select-selector {
        padding-left: 0;
      }
    }
    .actions-wrap {
    > .anticon {
      ${flexStyles('row', 'center', 'center')};
      margin-right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      font-size: 18px;
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
  }

  .add-btn {
    margin-left: 4px;
    width: 32px;
    height: 32px;
  }
`;
