import { Flex } from 'antd';

import styled from 'styled-components';

export const DocWrap = styled(Flex)`
  height: 100vh;
  background: var(--color-bg-right);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  header{
    font-size: 16px;
    font-weight: 600;
    color: var(--font-title-color);
  }
`;
