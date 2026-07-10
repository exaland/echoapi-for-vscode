import styled from "styled-components";

import Popover from "@/components/ui/Popover";

export const PredefinedResponseContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .info-wrap{
    column-gap:0px;
  }
  .response-content-wrap {
    flex: 1;
    margin-top: 12px;
    /* height: 400px; */
    overflow-y: auto;
  }
  .beautify-space-item {
    .beautify-select-selector {
        display: flex;
        gap: 4px;
        align-items: center;
        background: transparent !important;
        font-size: 12px;
        padding: 0 4px;
        padding-left: 6px;
      }
  }
`;

export const PopoverContainer = styled(Popover)`
  .add-icon {
    color: #22c55e;
  }
`;

export const ExampleNameContainer = styled.span`
  font-size: 12px;
  color: var(--font-content-color);
`;

export const ExampleFormWrap = styled.div`

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
`;
