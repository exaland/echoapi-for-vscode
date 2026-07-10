import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  #root{
    -webkit-font-smoothing: antialiased;
  }
  .page-global-tabs {
    .apipost-tabs-nav {
      > .apipost-tabs-nav-wrap {
        > .apipost-tabs-nav-list {
          .name {
            font-size: var(--font-size-14);
            font-weight: normal;
            color: var(--font-light-color);
            text-shadow: none;
          }

          .apipost-tabs-tab-active .name {
            font-weight: bold;
            color: var(--font-content-color);
          }
        }
      }
    }
  }
 
  .apipost-tabs-tab-active{
  /* font-weight :600 ; */
  }

  .apipost-drawer {
    &.apipost-drawer-open {
      -webkit-app-region: no-drag;
    }
  }

.apipost-tabs-dropdown .apipost-tabs-dropdown-menu {
  background-color: var(--popover-select-bg-color);
  border: 1px solid var(--color-border);
}

.apipost-btn-dashed {
    border-color: var(--color-dashed);
    box-shadow: none;
    &.normal {
      color: var(--font-content-color);
      background: transparent;

      &.solid {
        border-style: solid;
      }
    }

    &:hover {
      border-color: var(--selected-border-color);
      color: var(--color-primary);

      &.solid {
        border-style: solid;
      }
    }
  }

    .apipost-dropdown-menu-item {
      /* padding: 4px 6px !important; */
      color: var(--font-content-color);

      &:hover {
        color: var(--color-primary);
        background: var(--color-primary-opacity);
      }
      .apipost-btn-text{
        color: var(--font-content-color);
      }
    }
    .beautify-select .beautify-select-arrow{
      font-size: 10px;
    }
    .apipost-dropdown-menu-submenu-title{
      display: flex;
      align-items: center;
    }
    .beautify-dropdown .beautify-dropdown-menu .beautify-dropdown-menu-submenu-title .beautify-dropdown-menu-submenu-expand-icon .beautify-dropdown-menu-submenu-arrow-icon{
      color: var(--vscode-editorWidget-foreground, #cecece);
    }
    .beautify-tree-create-title{
      .beautify-dropdown-menu-item-icon{
      width:14px;
      height:14px;
      }
    }
    .beautify-dropdown-menu-title-content{
      white-space: nowrap;
    }
    .team-project-manage-popover{
    min-width: 270px;
    }
    .beautify-empty-normal .beautify-empty-description{
      color: var(--vscode-settings-headerBorder);
    }
   .beautify-spin-nested-loading >div>.beautify-spin .beautify-spin-text{
    text-shadow: none !important;
   }
   .beautify-btn-text:hover{
      text-decoration: underline;
  }
  .raw-parameter-pilot-bubble-tooltip{
    max-width: 320px !important;
  }
  .apipost-select-dropdown,
  .apipost-dropdown,
  .apipost-popover,
  .apipost-popover .apipost-popover-arrow::after,
  .beautify-tooltip,
  .beautify-tooltip .beautify-tooltip-arrow::after,
  .ant-dropdown,
  .ant-dropdown-menu.md-drop-menu, .ant-dropdown-menu-submenu.md-drop-menu
  {
    box-shadow: rgba(255, 255, 255, 0.72) 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 16px 24px -8px !important;
  }
  .apipost-dropdown .apipost-dropdown-menu .apipost-dropdown-menu-item-selected{
    text-shadow: 0 0 0.25px currentcolor;
  }
  .beautify-select-dropdown .beautify-select-item-option-active:not(.beautify-select-item-option-disabled){
    background-color: var(--vscode-list-inactiveSelectionBackground);
  }
  .beautify-radio-wrapper .beautify-radio-checked .beautify-radio-inner,
  .beautify-radio-wrapper .beautify-radio-inner{
    background-color: transparent !important;
  }
  
  .beautify-radio-wrapper .beautify-radio-checked .beautify-radio-inner::after{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0px;
    width: 8px;
    height: 8px;
    background-color: var(--color-primary);
  }
  .beautify-select-outlined:not(.beautify-select-disabled):not(.beautify-select-customize-input):not(.beautify-pagination-size-changer):hover .beautify-select-selector{
    border-color:var(--color-primary) !important;
  }
  .beautify-segmented .beautify-segmented-item-selected{
    /* font-weight: 600; */
    background: var(--vscode-input-background);
  }
  .beautify-btn-primary{
    background-color: var(--color-primary);
    color: var(--vscode-button-foreground, #FFFFFF);
  }
  .beautify-btn-primary:not(:disabled):not(.beautify-btn-disabled):hover{
    color: var(--vscode-button-foreground, #FFFFFF);
  }
  .beautify-tabs-top >.beautify-tabs-nav::before{
    /* border: none; */
  }

  .beautify-input,
  .beautify-input-number{
   background: var(--vscode-input-background);
   border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
  }
  .beautify-input-outlined:hover,
  .beautify-input-outlined:focus{
    background: var(--vscode-input-background);
    border:  1px solid var(--color-primary);
  }
 

  .beautify-select,
  .beautify-select-outlined:not(.beautify-select-customize-input){
    .beautify-select-selector{
    border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
  }
  }
 .beautify-dropdown-trigger{
  border:1px solid transparent;
  border-radius: 4px;
  &:hover{
    border-color: var(--color-primary);
  }
 }
 .beautify-table{
    .beautify-select {
      .beautify-select-selector{
        border-color: transparent !important;
      }
    }
    .beautify-select-focused{
        .beautify-select-selector{
          background: var(--highlight-change-color) !important;
          border-color: var(--color-primary) !important;
        }
      }
    .beautify-input{
      border-color: transparent !important;
    }
    .beautify-input:focus{
      border-color: var(--color-primary) !important;
    }
    .beautify-table-tbody .beautify-table-cell .beautify-input-outlined:focus{
      background: var(--highlight-change-color) !important;
    }
    .beautify-table-tbody .beautify-table-cell .beautify-input-outlined:hover{
      border-color: var(--color-primary) !important;
    }
  }
.beautify-dropdown .beautify-dropdown-menu .beautify-dropdown-menu-item-selected{
  color: var(--vscode-foreground);
}
.beautify-segmented .beautify-segmented-item {
  transition: all 0.05s !important;
}

.beautify-segmented .beautify-segmented-thumb {
  transition: all 0.05s !important;
}
.beautify-segmented .beautify-segmented-item::after{
  transition: all 0.05s !important;
}

.beautify-tooltip .beautify-tooltip-inner,
.beautify-tooltip .beautify-tooltip-arrow:before{
  background-color: var(--vscode-dropdown-listBackground, var(--vscode-settings-dropdownBackground));
}

.beautify-select-tree-list-scrollbar-thumb{
  background: var(--vscode-scrollbarSlider-background) !important;
}
.beautify-input-number-group-wrapper-outlined .beautify-input-number-group-addon{
  border: none;
}
`;

export default GlobalStyle;
