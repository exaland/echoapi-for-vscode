import styled from 'styled-components';

export const RequestPreTaskContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  > .apipost-btn {
    width: 100%;
    font-size: var(--font-size-14);
  }

  .item-container {
    .apipost-typography {
      font-size: var(--font-size-14);
      white-space: nowrap;
    }

    .apipost-input {
      font-size: var(--font-size-14);
    }

    .apipost-collapse-header {
      .apipost-input {
        height: 24px;
      }
    }
  }

  .apipost-select-selector {
    font-size: var(--font-size-14);
  }
`;
