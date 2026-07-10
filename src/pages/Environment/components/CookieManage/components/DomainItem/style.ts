import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const LabelContainer = styled.div`
  width: 100%;

  ${flexStyles('row', 'center', 'space-between')}

  .domin {
    flex: 1;
    width: 0;
    font-size: 14px;
    font-weight: 400;
    ${ellipsisStyle}
    color: var(--font-content-color);
  }

  .num,
  .title-cookie {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-primary);
  }

  .num {
    ${flexStyles('row', 'center', 'center')}
    margin: 0 20px 0 8px;
    padding: 0 6px;
    /* min-width: 24px; */
    border-radius: 100px;
    border: 1px solid var(--color-primary);
    font-size: 10px;
  }

  .anticon:hover {
    color: #ff583e;
  }
`;
