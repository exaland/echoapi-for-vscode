import styled from 'styled-components';

export const HistoryReportListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap:4px;
  overflow-y: auto;
  margin-top: 12px;
  .icon-ok{
    width: 12px;
    color: #26CEA4;
  }
  .icon-small-close{
    width: 12px;
    color: #EC3E3E;
  }
`;

export const HistoryReportListItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding:5px 8px;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover{
    background: var(--vscode-list-hoverBackground, #303030);
  }
  &.select-item{
    background: var(--vscode-list-hoverBackground, #303030);
  }
`;


