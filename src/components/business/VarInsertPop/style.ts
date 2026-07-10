import styled from 'styled-components';

export const ContentContainer = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  width: 320px;

  /* min-height: 220px; */

  /* max-height: 265px; */
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  pointer-events: none;

  .apipost-input {
    background-color: var(--search-big-select-color);
    box-shadow: none;
  }

  .apipost-select {
    background-color: var(--search-big-select-color);

    * {
      box-shadow: none !important;
    }

    &-selector {
      box-shadow: none;
    }
  }

  &.active {
    opacity: 1;
    pointer-events: unset;
  }

  .var-tabs {
    .apipost-segmented-item {
      flex: 1;
    }
  }

  .segmented-tabs-content {
    min-height: 180px;
  }

  .options-list {
    width: 100%;

    .icon-content {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      box-sizing: border-box;

      .anticon {
        font-size: 16px;
      }

      &.var {
        background: rgb(175 113 255 / 10%);

        .anticon {
          color: #b071ff;
        }
      }

      &.mock {
        background: rgb(6 124 237 / 10%);

        .anticon {
          color: #067ced;
        }
      }

      &.fixed {
        background: rgb(67 191 176 / 8%);

        .anticon {
          color: #43bfb0;
        }
      }

      &.desc {
        background: rgb(0 172 100 / 10%);

        .anticon {
          color: #00ac64;
        }
      }

      &.aiDesc {
        background: rgb(238 86 76 / 10%);

        .anticon {
          color: #ee564c;
        }
      }

      &.aiValue {
        background: rgb(255 156 222 / 11%);
      }
    }
  }
`;

export const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  width: 100%;
  min-height: 55px;
  box-sizing: border-box;
  gap: 12px;

  .label {
    font-size: 14px;
    color: var(--font-title-color);
  }

  .desc {
    color: var(--font-light-color);
  }

  &:hover {
    border-radius: 4px;
    background-color: var(--popover-select-bg-hover-color);
    cursor: pointer;
  }
`;
