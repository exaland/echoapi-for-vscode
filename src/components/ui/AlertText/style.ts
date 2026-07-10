import { Alert } from 'antd';

import styled from 'styled-components';

export const AlertTextWrap = styled(Alert)`
  padding: 4px 8px;
  border: none;
  line-height: 22px;
  background-color: var(--color-bg-page);

  .apipost-alert-message {
    color: var(--font-content-color);
  }
`;
