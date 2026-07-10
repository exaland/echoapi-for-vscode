import styled from 'styled-components';

export const NewBtnsContainer = styled.div`
  display: flex;
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
    & > button.beautify-btn-compact-last-item{
      width: 28px;
    }
  }

  .apipost-space-compact{
    width: auto;
  }
 
  .add-btn {
    margin-left: 4px;
    width: 32px;
    height: 32px;
  }
`;
