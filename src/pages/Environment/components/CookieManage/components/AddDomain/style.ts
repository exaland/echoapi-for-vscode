import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const AddDomainContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-start')}
  /* margin-bottom: 15px; */

  .domin {
    margin-right: 12px;
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: var(--font-content-color);
  }
`;
