import styled from 'styled-components';

export const RawEditorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100px;

  > .apipost-flex {
    flex: 1;

    > main {
      flex: 1;
      margin-top: 8px;
      height: 0;
    }
  }
  .beautify-text-btn-highlight{
    color: var(--color-primary) !important;
    &:hover {
      color: var(--color-primary) !important;
    }
  }
`;

export const ParamsFieldEditorContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-border);

  .right-panel {
    & > div {
      overflow: hidden;

      /* main {
        flex: auto;
        height: 100%;
      } */
    }
  }

  .how-use-desc {
    padding-right: 4px;
    font-size: var(--font-size-12);
    text-decoration: underline;
    color: var(--font-light-color);
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }

  .apipost-segmented {
    font-size: var(--font-size-14);
  }

  .segmented-tabs-header {
    margin-bottom: 0;
    padding: 0 6px !important;
    height: auto;

    & > .apipost-flex {
      justify-content: space-between;
      align-items: center;

      .tab-bar-extra-content-wrap {
        flex: none;
        margin-right: 8px;
        font-size: 10px;
        color: var(--font-light-color);
      }
    }
  }

  .segmented-tabs-content-item {
    border: none !important;
  }

  .icon-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    box-sizing: border-box;

    .anticon.link {
      font-size: var(--font-size-12);
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

    &.fn {
      background: rgb(255 71 165 / 10%);

      .anticon {
        color: rgb(255 71 165);
      }
    }

    &.aiValue {
      background: rgb(255 156 222 / 11%);
    }
  }
`;