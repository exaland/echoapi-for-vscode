import styled from 'styled-components';

export const DotWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .dot {
    border-radius: 50%;

    &.success {
      background-color: var(--color-success);
    }

    &.error {
      background-color: var(--color-error);
    }
  }
`;
