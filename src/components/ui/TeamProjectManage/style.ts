import styled from 'styled-components';

import { ellipsisStyle, flexStyles } from '@/assets/css/style';

export const TeamWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  .team-icon {
    color: var(--font-content-color);
    ${flexStyles('row', 'center', 'center')}

    svg {
      font-size: 28px;
    }
  }
  .no-select-project{
    color: var(--font-light-color);
    ${ellipsisStyle}
  }
  .apipost-popover{
    max-width: 80%;
  }
  .team-project-manage-popover{
    min-width: 265px;
  }
  .guest-name {
    max-width: 150px;
    color: var(--font-light-color);
    ${ellipsisStyle}
  }

  .team-name,
  .project-name {
    max-width: 100px;
    color: var(--font-light-color);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    ${ellipsisStyle}
  }

  .project-name {
    color: var(--font-title-color);
  }

  .project-icon {
    margin-right: 8px;
    color: var(--font-content-color);
    cursor: pointer;
  }
`;

export const ProjectContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  .sign-btn{
    font-size: 12px;
    color: var(--color-primary);
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      opacity: 0.8;
    }
  }
  .sign-desc{
    font-size: 10px;
    color: var(--font-light-color);
  }
  .header {
    padding: 0 20px;

    .header-left {
      font-size: var(--font-size-14);
      font-weight: 600;
      color: var(--font-title-color);
    }

    .header-right {
      cursor: pointer;

      .header-right-icon {
        font-size: var(--font-size-14);

        .anticon {
          color: var(--icon-color);
        }
      }

      .header-right-text {
        margin-left: 4px;
        color: var(--font-content-color);
      }

      &:hover {
        .header-right-text {
          color: var(--color-primary);
        }

        .header-right-icon {
          .anticon {
            color: var(--color-primary);
          }
        }
      }
    }
  }

  .search {
    padding: 0 20px;

    .search-input-wrap {
      background: var(--vscode-input-background);
    border: 1px solid var(--vscode-settings-numberInputBorder, transparent);
      /* background-color: var(--search-bg-color); */
    }
  }
`;
