import styled from 'styled-components';

export const EmptyWarper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  position: relative;
  font-size: var(--font-size-12);

.apipost-input {
  font-size: var(--font-size-12) !important;
}

  &.schema-td-warper {
    .indent-panel {
      margin-right: 8px;
      margin-left: 8px;
      width: 18px;
      height: 32px;
      border: var(--color-border) 0 solid;
      border-left-width: 1px;
    }
  }

  .schema-text-box {
    width: 200px;
    border-radius: 0;
    border: none;
    border: transparent 1px solid;

    input {
      min-width: 0;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    &:not(.items, .NodeRoot):hover {
      border-bottom: var(--base-color-brand) 1px solid;
    }

    &.item {
      &:hover {
        border-bottom: transparent 1px solid;
      }
    }
  }

  .text-panel {
    flex: 1;
    padding-left: 6px;
    font-size: var(--font-size-12);
    color: var(--font-title-color);

    .spn-import-model {
      margin-left: 5px;
      color: var(--color-primary);
      cursor: pointer;

      &:hover {
        color: var(--font-light-color);
      }
    }
  }

  .btn-list {
    padding-right: 10px;

    .btn-item {
      margin-left: 10px;
    }
  }

  .schema-td-warper {
    display: flex;
    float: left;
    position: relative;
    flex-direction: row;
    align-items: center;
    padding-left: 0;
    width: 100%;
    height: 100%;
    line-height: 32px;

    .indent-panel {
      margin-right: 8px;
      margin-left: 8px;
      width: 18px;
      height: 32px;
      border: var(--color-border) 0 solid;
      border-left-width: 1px;
    }

    &.schema-width-auto {
      width: auto !important;
    }
  }
`;
