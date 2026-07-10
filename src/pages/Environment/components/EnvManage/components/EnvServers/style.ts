import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';
import { ellipsisStyle } from '@/assets/css/style';

export const ServerNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  width: 100%;

  .env-name {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    ${ellipsisStyle}

    .icon-default {
      margin-left: 10px;
      padding: 0 5px;
      height: 20px;
      border-radius: 3px;
      font-size: 12px;
      line-height: 20px;
      font-weight: 400;
      color: var(--color-primary);
      background-color: var(--color-primary-opacity);
    }
  }

  .env-more {
    cursor: pointer;
    padding: 0 2px;
  }
`;

export const EnvAddContainer = styled.div`
  .anticon {
    color: #22c55e;
  }
`;

export const EnvServerTitleContainer = styled.div`
  ${flexStyles('row', 'center', 'space-between')}
  padding-bottom: 12px;
  font-size: 14px;
  font-weight: 400;
  color: var(--font-content-color);

  .anticon {
    font-size: 16px;
  }

  .server-add {
    font-size: 12px;
    font-weight: 400;
    color: var(--font-light-color);
    font-style: normal;
  }
`;

export const EnvServerContainer = styled.div`
  padding-bottom: 12px;
`;
