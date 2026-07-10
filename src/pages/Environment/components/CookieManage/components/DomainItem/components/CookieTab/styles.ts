import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const TabContainer = styled.div`
  padding: 16px;
  width: 100%;
  border-radius: 0 0 4px 4px;
  border: 1px solid var(--color-table-border);

  .cookie-item-add {
    border: 1px dashed var(--color-border);
  }
`;

export const BtnListContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-end')}
  text-align: right;
  margin-top: 8px;
  gap:8px;
  .apipost-btn {
    margin-top: 8px;
    margin-left: 8px;
  }
`;

export const TabItemContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 0 8px;
  height: 22px;
  border-radius: 2px;
  border: 1px solid var(--color-table-border);
  font-size: 12px;
  line-height: 26px;
  color: var(--font-content-color);
  background-color: var(--color-bg-page);
  cursor: pointer;

  .cookie-name {
    padding: 0 5px;
  }

  .cookie-item-close {
    .anticon {
      width: 8px;
      height: 8px;
    }
  }

  &:hover {
    border-color: var(--selected-border-color);
    color: var(--color-primary);
    background-color: var(--highlight-background-color-tertiary);
  }

  &.active {
    border-color: var(--selected-border-color);
    color: var(--color-primary);
    background-color: var(--highlight-background-color-tertiary);
  }
`;
