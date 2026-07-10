import styled from 'styled-components';

export const TreeMenuHeaderWarp= styled.div`
   display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-left: 14px; */
  margin-bottom: 6px;
  .upload,
  .pull{
    cursor: pointer;
    svg{
      fill:var(--font-title-color);
      &:hover{
        fill:var(--color-primary);
      }
      &:hover path{
        fill:var(--color-primary) !important;
      }
    }
  }
`;