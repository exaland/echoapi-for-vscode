import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';
import { hexToRGBA } from '@/utils/common';

export const ResponseAssertionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 17px 17px;
  width: 100%;
  height: 100%;
  padding-top: 5px;
  padding-right: 0;
  .assert-title {
    ${flexStyles('row', 'center', 'space-between')}
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-border);
    font-size: 14px;
    font-weight: 400;
    color: ${hexToRGBA('#333639', 0.8)};
  }

  .apipost-space-item {
    /* color: var(--font-content-color); */
    .content-title {
      color: var(--font-content-color);
    }
  }

  .assert-pot {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;

    .assert-content {
      flex-direction: column;
      justify-content: center;

      .content-title {
        padding: 8px 0;
        font-size: 14px;
        font-weight: 400;
        color: var(--font-content-color);

        &:first-child {
          padding-top: 12px;
        }
      }

      .content-item {
        padding: 2px 16px;
        width: 100%;
        border-radius: 4px;
      }
    }
  }
`;

interface AssertItemProps {
  $status: boolean;
}

export const ResponseAssertItemContainer = styled.span<AssertItemProps>`
  display: block;
  border-radius: 2px;
  font-size: var(--font-size-14);
  color: ${(props) => (props?.$status ? '#26CEA4' : '#FF583E')};
  background-color: ${(props) =>
    props?.$status ? hexToRGBA('#26CEA4', 0.1) : hexToRGBA('#FF583E', 0.1)};

  .anticon {
    font-size: var(--font-size-16);
  }

  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

export const BodyListContainer = styled.div`
  .big-title {
    height: 30px;
    line-height: 30px;

    .test-success {
      color: #26cea4;
    }

    .test-error {
      color: rgb(255 76 76);
    }

    .link-more {
      margin-left: 10px;
      color: var(--font-title-color);
      cursor: pointer;
    }
  }
`;

export const ScriptErrorContainer = styled.div.attrs({
  className: 'content-item',
})`
  font-size: var(--font-size-14);
  background-color: ${hexToRGBA('#FF583E', 0.1)};

  .runtime-script-error {
    color: rgb(255 76 76);
  }
`;
