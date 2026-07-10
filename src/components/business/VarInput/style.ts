import styled from 'styled-components';

export const VarInputContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;

  &.has-border .mini-editor {
    padding: 6.6px 11px;
    border-radius: var(--border-radius);
    border: 1px solid var( --color-table-border);
    line-height: 1.4;
    transition: all 0.3s;

    &:hover {
      border: 1px solid var(--color-primary);
    }
  }
`;
