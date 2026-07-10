import styled, { css } from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const RadioCss = css`
  label {
    ${flexStyles('row', 'center', 'center')}
    line-height: 1;
  }

  .apipost-radio {
    .apipost-radio-inner {
      /* width: 16px; */

      /* height: 16px; */
      background-color: transparent;

      &::after {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        width: 8px;
        height: 8px;
        background-color: var(--color-primary);
      }
    }
  }
`;
export const RadioWrap = styled.div`
  ${RadioCss}
`;
export const RadioGroupWrap = styled.div`
  /* 1 */
  .apipost-radio-group {
    ${flexStyles('row', 'center', 'flex-start')}
    ${RadioCss}
  }
`;
