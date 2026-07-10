import styled, { css } from 'styled-components';

export const itemModelWarper = css`
  display: flex;
  float: left;
  position: relative;
  z-index: 1000;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .btn-hide {
    display: none;
    flex-direction: row;
    align-items: center;
    padding: 0 5px;
    width: auto;

    /* width: 100px; */

    /* flex: 1; */
    height: 22px;
    border-radius: 3px;
    border: var(--base-color-brand) 1px solid;
    color: var(--base-color-brand);
    cursor: pointer;
    word-break: keep-all;

    &:last-child {
      margin-left: 10px;
    }
  }

  .txt-box {
    flex: 1;
    height: 100%;
    border: none;
    font-size: var(--font-size-12);
  }

  .txt-description {
    flex: 1;
    margin: 0 10px;
    width: 0;
    overflow: hidden;
    font-size: var(--font-size-12);
    white-space: nowrap;
    color: var(--content-color-fourth);
  }

  input {
    cursor: text !important;
  }
`;

export const ItemModelWarperContainer = styled.div`
  ${itemModelWarper}
  .apipost-btn {
    padding: 0 5px !important;
    width: auto !important;
  }
`;
