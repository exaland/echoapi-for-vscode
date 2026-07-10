import styled from 'styled-components';

export default styled.div`
  width: 100%;
  height: 100%;

  .cookie-flex {
    height: 100%;
  }

  .cookie-title {
    width: 100%;
  }

  .cookie-content {
    flex: 1;
    overflow-y: auto;
    /* padding-right: 10px; */

    .apipost-collapse {
      background-color: transparent;

      .apipost-collapse-item {
        margin-bottom: 8px !important;
        overflow: hidden;
      }
    }
  }
`;
