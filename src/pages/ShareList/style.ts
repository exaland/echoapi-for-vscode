import { flexStyles } from "@/assets/css/style";
import styled from "styled-components";

export const ShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: var(--color-bg-right);
  .response-empty-wrap {
    .apipost-empty-image {
      margin-bottom: 16px;

      .icon-empty-wrap {
        font-size: 80px;
        color: var(--vscode-settings-headerBorder);
      }
    }
  }
  .beautify-spin-nested-loading {
    flex: 1;
    .beautify-spin-container {
      height: 100%;
    }
  }
`;

export const DocListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
  overflow-y: hidden;
`;

export const ItemTitleContainer = styled.div`
  ${flexStyles("row", "center", "space-between")}
  padding: 16px 8px;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  .more-operate-wrap {
    display: flex;
    margin-left: 4px;
    flex: 1;
    justify-content: flex-end;
    visibility: hidden;
  }
  .panel-icon {
    width: 28px;
    height: 28px;
  }
  &:hover {
    .more-operate-wrap {
      display: flex;
      visibility: visible;
    }
  }

  &:hover,
  &.select-item {
    background: var(--vscode-list-hoverBackground, #303030);
  }

  .time {
    font-size: 10px;
    flex: 1;
  }
  .name {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    flex: 1;
    overflow: hidden;
    svg {
      font-size: 14px;
    }
  }
`;

export const TabsWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  position: relative;
  flex: 1;
  overflow-y: auto;
  .share-list-delete-btn {
    display: none;
  }
  .share-list-delete-btn.show {
    display: flex;
  }
  .apipost-flex {
    .apipost-btn {
      margin-left: 12px;
      padding: 4px 8px;
      height: 28px;

      &.apipost-btn-link {
        color: var(--font-light-color);

        &:hover {
          color: var(--font-content-color);
        }
      }
    }
  }

  .apipost-tabs {
    height: 100%;

    .apipost-flex {
      /* margin-bottom: 16px; */
    }

    .apipost-tabs-content {
      height: 100%;

      .apipost-tabs-tabpane {
        height: 100%;
      }
    }
  }

  .apipost-tabs-tab {
    padding: 10px;

    .apipost-tabs-tab-btn {
      font-size: var(--font-size-14);
    }
  }

  .apipost-checkbox-group {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const ControlExtraContentStyles = styled.div<{
  $token: Partial<GlobalThemeToken>;
}>`
  ${flexStyles("row", "center", "flex-start")};
  position: absolute;
  left: 0;
  z-index: 2;
  padding: 0 16px;
  width: 100%;
  height: 36px;
  background-color: var(--color-bg-right);
  box-shadow: 0 2px 16px 0 var(--box-shadow-modal-color);

  .apipost-btn {
    margin-left: 12px;
    width: 82px;
    height: 28px;
  }

  .apipost-checkbox-wrapper {
    align-items: center;

    .apipost-checkbox-indeterminate {
      .apipost-checkbox-inner {
        border-color: var(--color-primary);
        background-color: var(--color-bg-right);
      }
    }

    span {
      span {
        color: var(--color-primary);
      }
    }
  }
`;

export const ShareListWrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
`;
