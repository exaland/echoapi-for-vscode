import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const UrlPanelContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-start')};
  width: 100%;
  .url-group-input{
    border-radius: 0;
    background-color: transparent;
  }

    .apipost-flex {
      .url-group {
        flex: 1;
      }
    }

    /* .apipost-btn {
      margin-left: 8px;

      &:last-child,
      .apipost-dropdown-open {
        margin-left: 0;
        width: 24px;
      }
    } */

    .apipost-btn {
      height: 36px;
      font-size: var(--font-size-14);
    }

  > .url-group-wrap {
    flex: 1;
    padding: 3px;
  }
  .beautify-btn{
    height: 36px !important;
  }
  .beautify-dropdown-trigger{
    border-color: var(--vscode-settings-headerBorder);
  }
`;
