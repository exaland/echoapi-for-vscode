import { Flex } from 'antd';

import styled from 'styled-components';

export const CurlWrap = styled(Flex)`
  height: 100vh;
  align-items: end;
  background: var(--color-bg-right);
  padding-top: 8px;
  .beautify-btn{
    width: 120px;
    margin: 20px 10px;
    }
  .curl-monaco-editor{
    height: calc(100% - 70px);
  }
`;
