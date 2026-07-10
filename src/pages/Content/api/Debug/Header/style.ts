import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const HeaderContainer = styled.div`
  ${flexStyles('row', 'center', 'flex-start')};
  width: 100%;
  gap: 4px;
  > .url-group-wrap {
    flex: 1;
  }

  .url-group-container{
    flex: 1;
    display: flex;
    align-items: center;
    height: 28px;
    .env-desc{
      max-width: 50%;
      overflow: hidden;
      font-size: var(--font-size-14);
      line-height: 36px;
      white-space: nowrap;
      color: var(--font-light-color);
      text-overflow: ellipsis;
    }
    .apipost-input{
      flex: 1;
      height: 100%;
    }
  }
  .beautify-btn{
    height: 36px !important;
  }
`;