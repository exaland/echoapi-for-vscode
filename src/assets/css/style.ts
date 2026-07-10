import styled, { css } from 'styled-components';

// flex style function
export const flexStyles = (
  direction?: 'row' | 'column',
  alignItems?: 'center' | 'flex-start' | 'flex-end',
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
) => `
  display: flex;
  flex-direction: ${direction || 'row'};
  align-items: ${alignItems || 'center'};
  justify-content: ${justifyContent || 'center'};
`;
// Unified menu style in Dropdown
export const DropdownMenuWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  .apipost-dropdown-menu {
    background-color: var(--color-bg-right);

    .apipost-dropdown-menu-item {
      color: var(--font-content-color);

      &:hover {
        color: var(--color-primary);
        background: var(--color-primary-opacity);
      }
      .apipost-btn-text{
        color: var(--font-content-color);
      }
    }
  }
`;

export const ellipsisStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const operateIconBg = css`
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius);
  font-size: 12px;
  color: var(--icon-color);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: var(--vscode-toolbar-hoverBackground);
  }
`;
