import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const AiDescriptionWrap = styled.div`
  max-height: 280px;
  overflow-y: auto;

  .params-desc-item {
    padding-left: 8px;
    width: 224px;
    height: 32px;
    font-size: var(--font-size-14);
    line-height: 32px;
    ${ellipsisStyle}

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-opacity);
      cursor: pointer;
    }
  }
`;

export const AiWrap = styled.div`
  .ai-icon {
    color: var(--font-light-color);

    &:hover {
      color: var(--color-primary);
    }
  }
`;
