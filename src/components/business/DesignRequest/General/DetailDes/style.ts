import styled from 'styled-components';

export const DetailDesContainer = styled.div`
  width: 100%;
  height: 480px;
  flex: 1;
  .bytemd-split{
    .bytemd-body{
      display: flex;
    }
    .bytemd-editor{
      flex: 1;
    }
    .bytemd-preview{
      display: none;
    }
    .bytemd-status{
      .bytemd-status-right>label{
        display: none !important;
      }
    }
  }
`;
