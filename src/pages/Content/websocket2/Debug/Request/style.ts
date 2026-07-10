import styled from 'styled-components';

export const SettingWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .apipost-input {
    /* width: 120px; */
    width: 100%;
  }

  .apipost-input-number {
    width: 100%;
  }

  .apipost-select {
    width: 100%;
  }

  .setting-desc {
    color: var(--font-light-color);
  }
`;

export const MessageHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  .beautify-select-selector{
    font-size: 12px !important;
  }
  .beautify-select .beautify-select-arrow{
    font-size: 10px;
  }
`;
