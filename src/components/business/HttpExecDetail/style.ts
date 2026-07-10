import styled from 'styled-components';

export const HttpExecDetailWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  width: 100%;

  .url-container {
    .icon {
      width: auto;
    }

    .url {
      margin-left: 8px;
      font-size: var(--font-size-14);
      color: var(--font-content-color);
      word-break: break-all;
    }
  }

  .apipost-tabs-tab {
    padding: 4px 8px 12px;
  }

  .assert-item {
    padding: 2px 12px;
    padding-left: 16px;
    border-radius: 4px;
    font-size: var(--font-size-14);

    .apipost-alert-message {
      max-width: 510px;
    }
  }
`;
