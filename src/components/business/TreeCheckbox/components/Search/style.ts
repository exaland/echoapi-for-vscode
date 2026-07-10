import styled from 'styled-components';

export const SearchContainer = styled.div`
  width: 100%;
  height: 32px;
  
  .apipost-flex {
    height: 100%;

    .apipost-input-affix-wrapper {
      padding: 6px 8px;
      height: 100%;
      background-color: var(--search-bg-color);

      .apipost-input-suffix {
        min-width: 80px;
      }
    }
  }

  .search-wrap {
    flex: 1;

    svg {
      color: var(--icon-color);
    }

    .apis-mark-select-wrap {
      .apipost-select-selector {
        padding-left: 0;
      }
    }
  }

  .add-btn {
    margin-left: 4px;
    width: 32px;
    height: 32px;
  }
`;
