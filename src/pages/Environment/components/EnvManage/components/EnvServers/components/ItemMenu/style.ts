import styled from 'styled-components';

export const DeleteContainer = styled.div<{ $disable: boolean }>`
  & {
    cursor: ${(props) => props?.$disable && 'not-allowed'};

    .anticon {
      margin-right: 4px;
    }

    &:hover {
      /* color: var(--color-primary); */
      color: ${(props) => !props?.$disable && ' var(--color-primary)'};
    }
  }
`;

export const EditContainer = styled.div`
  .anticon {
    margin-right: 4px;
  }

  &:hover {
    color: var(--color-primary);
  }
`;
