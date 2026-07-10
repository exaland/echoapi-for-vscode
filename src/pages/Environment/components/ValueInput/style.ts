import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export default styled.div`
  width: 100%;
  height: 36px;
  ${flexStyles('row', 'flex-start', 'space-between')};

  .value-input-textarea {
    position: relative;
    width: 100%;

    .apipost-input {
      padding: 4px 12px;
      overflow: hidden;
      border: 1px solid transparent;
      resize: none;

      &:hover {
        border: 1px solid var(--color-primary);
        background-color: var(--highlight-change-color);
      }
    }

    .apipost-input:focus {
      z-index: 700;
      border: 1px solid var(--color-primary);
      color: var(--font-content-color);
      background-color: var(--highlight-change-color);
    }

    .apipost-input::placeholder {
      line-height: 28px;
    }
  }
`;
