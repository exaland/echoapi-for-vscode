import { Input } from 'antd';

import styled from 'styled-components';

export const TitleEditInput = styled(Input)`
  padding-right: 0;
  padding-left: 0;
  width: 100%;
  height: 32px;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid transparent;
  box-shadow: none;
  outline: none;
  font-size: 16px;

  &:hover,
  &:focus {
    box-shadow: none;
    border-bottom-color: var(--selected-border-color);
  }
`;
