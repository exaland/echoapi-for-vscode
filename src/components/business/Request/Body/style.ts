import styled from "styled-components";

import { flexStyles } from "@/assets/css/style";

export const RequestBodyContainer = styled.div`
  width: 100%;
  height: 100%;
  .other-btn{
    .beautify-btn:hover{
      opacity: 0.6;
    }
  }
  > .apipost-flex {
    height: 100%;

    .request-body-header {
      display: flex;

      /* height: 28px; */
      height: 24px;
      /* padding-left: 8px; */
    }

    .request-body-content-wrap {
      flex: 1;
      margin-top: 8px;
      height: 0;
    }
  }

  .apipost-radio-group {
    .apipost-radio-wrapper {
      font-size: var(--font-size-14);
    }
  }
  .request-body-header {
    .beautify-radio-inner{
      transform: scale(0.7);
    }
    .beautify-radio{
      margin-top:3px;
    }
    .beautify-radio-wrapper span.beautify-radio+*{
      padding-inline-start:4px;
    }
    .beautify-select {
      .beautify-select-selector {
        display: flex;
        gap: 4px;
        align-items: center;
        background: transparent;
        font-size: 12px;
        padding: 0 4px;
        padding-left: 6px;
      }
    }
  }
`;

export const RequestBodyContentContainer = styled.div`
  ${flexStyles("row", "center", "center")};
  padding: 20px 0;
  width: 100%;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);

  .apipost-upload-wrapper {
    text-align: center;
  }
`;
