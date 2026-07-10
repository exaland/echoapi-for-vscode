import styled from 'styled-components';

export const ResponseResultWrap = styled.div`
  width: 100%;
  height: 100%;

  .response-result-tabs-wrap {
    overflow-y: hidden;

    .tab-bar-extra-content-wrap {
      margin-left: 6px;
.beautify-select-selector{
   display: flex;
    gap: 4px;
    align-items: center;
     background: transparent;
  font-size: 12px;
  padding: 0 4px;
  padding-left: 6px;
}
      .icon-copy {
        font-size: 16px;
        color: var(--icon-color);
        cursor: pointer;

        &:hover,
        &.wrap-show {
          color: var(--color-primary);
        }
      }
    }

    .segmented-tabs-content {
      height: 0;
      min-height: auto;
    }
  }

  .response-result {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .response-result-content {
    height: calc(100% - 40px);
    overflow: auto;

    .content-item {
      height: 100%;
    }
  }

  .visualization-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }
`;
