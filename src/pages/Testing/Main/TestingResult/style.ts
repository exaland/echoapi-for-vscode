import styled from 'styled-components';

export const TestingResultWrapper = styled.div`
display: flex;
justify-content: space-between;
    border: 1px solid var(--color-border);
    background: var(--table-header-bg-color);
    padding: 16px;
    margin-top: 12px;
    border-radius: 4px;
    .content{
      color: #111827;
    }
    .title{
      color: #667085;
    }
`;
