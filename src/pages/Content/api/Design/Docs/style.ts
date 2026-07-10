import styled from 'styled-components';

export const TabsWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  position: relative;
  flex: 1;
  overflow-y: auto;
  .beautify-text-btn-highlight{
    color: var(--color-primary) !important;
    &:hover {
      color: var(--color-primary) !important;
    }
  }
  .xigod{
    display: none !important;
  }
 .redoc-wrap{
  height: 100% !important;
  .api-content{
    font-size: 12px;
    overflow: auto !important;
  }
  &>div:last-child{
    width: calc(40% + 10px) !important;
  }
}
  .menu-content{
    .scrollbar-container{
      display:  none !important;
      div{
        display: none !important;
      }
    }
  }
  .share-list-delete-btn{
    display: none;
  }
  .share-list-delete-btn.show{
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
    padding: 0 16px;
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
    /* padding: 10px; */

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