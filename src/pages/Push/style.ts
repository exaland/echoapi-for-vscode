import styled from 'styled-components';

export const PushWrap = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  background: var(--color-bg-right);
`;


export const PushWrapContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  min-width: 90%;
  max-width: 90%;
  min-height: 80%;
  &>.title{
    font-size: 20px;
    font-weight: 600;
    color: var(--font-title-color);
    margin-bottom: 20px;
  }
 
 
`;