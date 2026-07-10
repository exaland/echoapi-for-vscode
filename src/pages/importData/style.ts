import { Flex } from 'antd';

import styled from 'styled-components';

export const ImportDataWrap = styled(Flex)`
  height: 100vh;
  align-items: center;
  background: var(--color-bg-right);
  .beautify-spin-nested-loading{
    height: 100%;
    width: 100%;
    .beautify-spin-container{
    height: 100%;
    }
  }
`;
