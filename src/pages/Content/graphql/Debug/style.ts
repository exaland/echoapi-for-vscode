import { Flex } from 'antd';

import styled from 'styled-components';

export const GraphqlDebugContainer = styled(Flex)`
  width: 100%;
  height: 100%;

  > header {
    padding: 0 16px;
  }

  > main {
    flex: 1;
  }
`;
