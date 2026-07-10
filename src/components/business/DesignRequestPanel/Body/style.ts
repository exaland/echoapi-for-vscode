import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const RequestBodyContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-x: hidden;
  overflow-y: auto;
  .request-body-add-btn{
    padding: 2px 8px;
    /* border: 1px solid var(--color-border); */
    cursor: pointer;
    &:hover{
      opacity: 0.8;
    }
  }
  .design-request-body-type-item{
    padding: 5px 8px;
    font-size: 14px;
    color: var(--font-light-color);
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    &:hover,
    &.selected{
      background-color: var(--select-hover-color);
      color: var(--color-primary);
      .design-request-body-type-item-icon{
        visibility: visible;
      }
    }
    .design-request-body-type-item-icon{
      font-size: 16px;
      visibility: hidden;
    }
  }
  .request-body-content-wrap {
      flex: 1;
      margin-top: 8px;
      height: 0;
    }
  > .apipost-flex {
    /* height: 100%; */

    .request-body-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      /* height: 28px; */
      height: 32px;
    }
  }

  .apipost-radio-group {
    .apipost-radio-wrapper {
      font-size: var(--font-size-14);
    }
  }
`;

export const RequestBodyContentContainer = styled.div`
  ${flexStyles('row', 'center', 'center')};
  padding: 20px 0;
  width: 100%;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);

  .apipost-upload-wrapper {
    text-align: center;
  }
`;
