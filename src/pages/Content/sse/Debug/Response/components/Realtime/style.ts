import styled from 'styled-components';

export const RealtimeContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const FlowResponseRenderTitleWrap = styled.div.attrs({ className: 'title' })`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  &.complete {
    color: var(--color-warning);
  }
  .event-message{
    border-radius: 4px;
    color: #0DA4A1;
    background: #0DA4A11A;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    &.connected{
      color:#12B76A;
      background:#12B76A1A;
    }

    &.error{
      color:#FF583E;
      background:#FF583E1A;
    }

    &.message{
      color: #0787FF;
      background: #0787FF1A;
    }
    &.completed{
      color: #6941C6;
      background: #6941C61A;
    }
    &.reconnecting{
      color: #FA8C16;
      background: #FACC151A;
    }
    &.close{
      color: #33363966;
      background: #F6F8FA;
    }
  
  }
`;

export const PanelsWrap = styled.div`
  padding: 8px;
  padding-left: 0;
  height: 100%;
`;
