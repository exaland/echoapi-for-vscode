import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const AllCheckContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-start')}
  /* margin-top: 16px; */
  padding: 8px;
  width: 100%;
  height: 30px;
  background-color: var(--search-big-select-color);
  /* border-radius: 4px 4px 0 0; */
  border-bottom: 1px solid var(--color-table-border);
  flex-wrap: nowrap;
  label{
    span{
      white-space: nowrap;
    }
  }
  .apipost-checkbox-wrapper {
    ${flexStyles('row', 'center', 'flex-start')};
    /* .apipost-checkbox-inner {
      background-color: var(--color-bg-tree-page);
    } */
  }
  .all-check-desc{
    font-size: 12px;
    color: var(--font-light-color);
    margin-left: 8px;
  }
  .all-check-text {
    font-size: 14px;

    .all-check-num {
      color: var(--color-primary);
    }
  }
`;
