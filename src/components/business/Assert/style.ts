import styled from 'styled-components';

export const AssertWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .label {
    flex-shrink: 0;
    font-size: var(--font-size-14);
  }
  .beautify-input-affix-wrapper,
  .mini-editor{
    border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
    background: var(--vscode-input-background);
  }
  .apipost-select-arrow {
    font-size: var(--font-size-12);
  }

  .assert-input,
  .collection-variable-select {
    flex: auto;
  }

  .collection-variable-select {
    width: 100%;

    .apipost-select-selector {
      height: 100%;
      max-height: 200px;
      overflow-y: auto;
    }

    .apipost-select-selection-search {
      .apipost-select-selection-search-mirror {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
`;

export const DescWrapper = styled.span`
  font-size: 12px;
  color: var(--font-light-color);
`;

