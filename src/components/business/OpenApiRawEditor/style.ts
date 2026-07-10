import styled from 'styled-components';

export const RawEditorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100px;

  > .apipost-flex {
    flex: 1;

    > main {
      flex: 1;
      margin-top: 8px;
      height: 0;
    }
  }
`;
