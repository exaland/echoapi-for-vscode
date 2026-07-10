import { styled } from "styled-components";

export const TestingMainWarp = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  gap: 12px;
  .segmented-tabs-content{
    min-height: 100px !important;
  }
  .beautify-progress-outer{
    width: 99% !important;
  }
  .event-btns{
    .beautify-btn{
      padding: 0px 12px;
      height: 24px;
    }
    .select-all{
      padding: 0px !important;
    }
  }
`;

export const TestingConfigWrap = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 12px;
`;

export const FunctionalWrap = styled.div`
display: flex;
flex-direction: column;
gap: 12px;
padding: 12px 16px;
background: var(--table-header-bg-color);
border:1px solid var(--color-border);
border-radius: 4px;



.switch-name{
  cursor: pointer;
}
.beautify-input-number .beautify-input-number-input,
.beautify-upload-wrapper{
  background: var(--search-bg-color);
}
.beautify-upload-wrapper{
  border-radius: 4px;
  border: 1px solid var(--color-table-border);
  height: 32px;
}
.beautify-upload-wrapper.disabled{
  cursor: not-allowed;
}
.beautify-upload{
  .beautify-btn-text{
    color: var(--font-content-color);
  }
}
.env-select-wrap,
.icon-manage-env{
  background-color: var(--search-bg-color) !important;
}
.icon-manage-env .anticon,
.env-select-wrap .anticon{
  color: var(--font-content-color) !important;
}
.file-name-wrap{
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 30px;
  background: var(--search-bg-color);
    white-space: nowrap;
    padding: 0 4px;
    border-radius: 4px;
    border:1px solid var(--vscode-editor-lineHighlightBorder, #262628);
    &:hover{
      border:1px solid var(--color-primary);
    }
    .name{
      max-width: 180px;
    text-overflow: ellipsis;
    overflow: hidden;
    }
  &.disabled{
    cursor: not-allowed;
  }
}
.beautify-input-number-outlined{
  width: 100%;
}
`;

export const LoadTestingWrap = styled.div`
display: flex;
flex-direction: column;
gap: 6px;
padding: 12px 16px;
background: linear-gradient(0deg, var(---, var(--table-header-bg-color)), var(---, var(--table-header-bg-color))),
linear-gradient(89.36deg, rgba(255, 255, 255, 0) 0%, rgba(131, 92, 255, 0.2) 100%);

border-radius: 4px;
border:1px solid var(--color-border);
.title{
  font-size: 16px;
  font-weight: 600;
  color: var(--font-title-color);
}
.desc{
  font-size: 12px;
  color: var(--font-content-color);
}
.beautify-btn{
  width: 190px;
  margin-top: 6px;
}
`;

export const ResultListWarp = styled.div`
  /* overflow: hidden; */
  .beautify-tabs{
    height: 100%;
  }
  .beautify-tabs .beautify-tabs-content-holder{
    /* overflow-y: auto; */
  }
  .beautify-tabs .beautify-tabs-tab{
    padding:10px 8px !important;
  }
`;