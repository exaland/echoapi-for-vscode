import styled, { css } from 'styled-components';

export const keyWarper = css`
  /* padding-left: 5px; */
  position: relative;

  .item-mock {
    float: left;
    width: 100%;

    .apipost-input-inner-wrapper {
      display: flex;

      /* width: calc(100% - 10px); */
      float: left;
      height: 33px;
      border-radius: 0;

      /* border-color: transparent; */

      input {
        flex: 1;
        margin-right: 10px;
      }
    }

    .apipost-input-inner-wrapper-disabled {
      /* border-bottom: 1px solid transparent; */
    }
  }

  .spn-require {
    margin: 0 5px;
    width: 16px;
    height: 16px;

    /* display: flex;
        justify-content: center;
        align-items: center; */
    border-radius: 2px;
    font-size: var(--size-18px);
    line-height: 20px;
    text-align: center;
    color: var(--content-color-fourth);
    background-color: transparent;
    cursor: pointer;

    &.checked {
      color: var(--base-color-brand);
    }
  }

  .mock-auto-vars {
    height: 100%;

    .apipost-select-selector {
      height: 32px;
      border-radius: var(--border-radius);
      background: transparent !important;
      box-shadow: none !important;

      &:hover,
      &:focus {
        box-shadow: none;
      }
    }
  }
`;

export const KeyWarperContainer = styled.div`
  ${keyWarper}
`;
