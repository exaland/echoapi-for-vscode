import styled from 'styled-components';

import { ellipsisStyle } from '@/assets/css/style';

export const VersionModalWrap = styled.div`
  .version-tip {
    font-size: var(--font-size-14);
    padding: 10px 0 10px 12px;
    border: 1px solid var(--color-table-border);
    border-radius: 4px;
    color: var(--font-content-color);
    flex:1;
  }

  .apipost-select {
    height: 40px;

    .apipost-select-selector {
      font-size: var(--font-size-14);
    }
  }

  .apipost-collapse-header {
    font-size: var(--font-size-14);
  }

  .prev-tag {
    right: 0;
    padding: 0 4px;
    height: 24px;
    border-radius: var(--border-radius);
    line-height: 24px;
    color: #ff583e;
    background-color: #ff583e1a;
  }

  .next-tag {
    padding: 0 4px;
    height: 24px;
    border-radius: var(--border-radius);
    line-height: 24px;
    color: #26cea4;
    background-color: #26cea41a;
  }
`;

export const DiffUserEditWrap = styled.span`
  width: 156px;
  ${ellipsisStyle}
`;
