import styled from 'styled-components';

export const LoadingWrapper = styled.div`
  display: flex;
  z-index: 99999;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  background: var(--color-bg-right);
  flex-flow: row nowrap;

  img,
  svg {
    margin: 0 auto;
    width: 128px;
    height: 128px;
  }
`;
