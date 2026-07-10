import styled from 'styled-components';

export const ParamsManageContainer = styled.div`
  width: 100%;
  height: 100%;

  .params-flex {
    height: 100%;
  }

  .params-content {
    flex: 1;
    overflow-y: auto;
  }
  .params-content{
    &>div{
      padding: 0;
    }
  }
`;
