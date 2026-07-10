import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const EmptyWrap = styled.div`
  height: 100%;
  width: 100%;
  .apipost-empty {
    height: 100%;
    color:var(--vscode-settings-headerBorder);
    ${flexStyles('column', 'center', 'center')}
    &> * {
      height: auto;
    }
    .beautify-empty-description{
      color: var(--vscode-tab-unfocusedInactiveForeground);
    }
  }
`;

export default EmptyWrap;
