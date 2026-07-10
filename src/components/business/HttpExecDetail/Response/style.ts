import styled from 'styled-components';

export const ResponseWrapper = styled.div`
  width: 100%;

  .apipost-tabs-tabpane {
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const EmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 240px;
`;
