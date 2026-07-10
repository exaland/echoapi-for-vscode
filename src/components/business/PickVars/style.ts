import styled from 'styled-components';

export const PickVarWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .label {
    flex-shrink: 0;
    width: 56px;
    font-size: var(--font-size-14);
  }

  .apipost-select-arrow {
    font-size: var(--font-size-12);
  }
`;

export const DescWrapper = styled.span`
  font-size: 12px;
  color: var(--font-light-color);
`;
