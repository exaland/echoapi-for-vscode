import styled from 'styled-components';

export const NewJsonViewContainer = styled.div`
  height: 100%;
  max-height: 400px;
  overflow: auto;

  .string-value {
    word-break: break-all;
  }

  .object-key {
    > span {
      word-break: break-all;
    }
  }
`;

export const JsonViewWrap = styled.div`
  .react-json-view {
    padding: 12px;
    min-height: 200px;
    background-color: var(--background-color-primary) !important;
    word-break: break-all;
  }

  .object-key {
    color: var(--content-color-primary) !important;
  }

  .object-size {
    color: var(--content-color-secondary) !important;
  }

  .variable-row,
  .object-key-val {
    border-left-color: var(--border-color-default) !important;
  }

  .object-key-val > span {
    &:first-child {
      span:last-child {
        color: '#5AB8D1' !important;
      }
    }
  }

  .brace-row {
    /* stylelint-disable-next-line no-descending-specificity */
    span {
      color: '#5AB8D1' !important;
    }
  }
`;

export const OtherPreViewWrap = styled.div`
  padding: 12px;
  min-height: 200px;
  overflow: hidden;
  background-color: var(--background-color-primary);

  pre {
    overflow-x: auto;
  }
`;
