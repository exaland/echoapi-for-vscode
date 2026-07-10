import styled from 'styled-components';

export const ContentWrap = styled.div`
  height: 500px;
  overflow: auto;

  .apipost-collapse-content-box {
    padding: 0 !important;
  }
`;

export const VersionEditWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 320px;

  /* stylelint-disable-next-line selector-class-pattern */
  .diffOverview {
    display: none;
  }
`;
