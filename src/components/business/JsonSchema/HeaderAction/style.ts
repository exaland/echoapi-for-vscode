import styled, { css } from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const HeaderActionWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  padding-left: 17px;
  width: 100%;
  ${flexStyles('row', 'center', 'flex-end')}
  height: 32px;
  line-height: 32px;

  .preview-btn {
    margin-right: 10px;
  }

  .action-right {
    .apipost-btn {
      height: 26px;
    }
  }
`;

export const ImportModalWrapper = css<{ $token: Partial<GlobalThemeToken> }>`
  margin: 0 8px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
`;

export const ImportContainer = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  height: 400px;
  overflow-y: scroll;

  .import-header {
    .apipost-segmented {
      margin-bottom: 16px;
      width: 100%;
      height: 32px;

      .apipost-segmented-item {
        ${ellipsisStyle}
        flex: 1;
      }
    }
  }

  ${ImportModalWrapper}
`;

export const EditRawContainer = styled.div`
  margin-top: 10px;
  height: 400px;
`;

export const PreviewContainer = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  ${ImportModalWrapper}
  margin-top: 10px;
  height: 432px;
`;

export const PreviewTitleContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-start')}
  > button {
    ${flexStyles('row', 'center', 'center')}
    margin-left: 5px;
  }
`;
