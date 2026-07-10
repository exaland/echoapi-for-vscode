import { Flex } from 'antd';

import styled from 'styled-components';

export const ApiDebugContainer = styled(Flex)`
  width: 100%;
  height: 100%;

  > header {
    padding: 0 16px;
  }

  > main {
    flex: 1;
  }
`;

export const RequestContainer = styled.div`
  padding: 0 16px 12px;
  width: 100%;
  height: 100%;
  .beautify-text-btn-highlight{
    color: var(--color-primary) !important;
    &:hover {
      color: var(--color-primary) !important;
    }
  }
`;

