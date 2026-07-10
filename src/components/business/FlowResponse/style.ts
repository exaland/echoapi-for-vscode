import styled from 'styled-components';

export const FlowResponseWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  height: 100%;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow-y: auto;

  .icon-span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    border-radius: 2px;

    &.message {
      background-color: rgb(33 144 255 / 15%);
    }

    &.send {
      background-color: rgb(255 199 0 / 15%);
    }
  }

  .icon {
    font-size: var(--font-size-14);
  }

  .apipost-list-item {
    cursor: pointer;

    .flow-icon {
      display: none;
      font-size: 16px;
      color: var(--icon-color);

      &:hover {
        color: var(--color-primary);
      }
    }

    &.active {
      background: var(--form-hover-color);

      .flow-icon {
        display: inline-block;
      }
    }

    &:hover {
      background: var(--form-hover-color);

      .flow-icon {
        display: inline-block;
      }
    }
  }
`;
