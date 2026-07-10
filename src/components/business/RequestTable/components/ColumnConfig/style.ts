import { Flex } from 'antd';
import styled from 'styled-components';

export const DescMoreItemWrap = styled(Flex).attrs({
  align: 'center',
  justify: 'space-between',
})`
  height: 26px;

  &.tips-item-wrap {
    color: var(--font-light-color);
  }
`;

export const ColumnConfigContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 36px;
  padding-inline: 8px;
  background-color: transparent;
  .raw-parameter-pilot-bubble-tooltip{
    max-width: 320px;
  }
  .icon-navi-more{
    cursor: pointer;
    color: var(--font-light-color);
    &:hover{
      color: var(--color-primary);
    }
  }
`;