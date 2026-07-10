import styled from 'styled-components';

const admonitionColorNote = '#9373ee';
const admonitionColorTip = '#52c41a';
const admonitionColorInfo = '#1890ff';
const admonitionColorCaution = '#fa8c16';
const admonitionColorDanger = '#ff4d4f';
const mdTheme: any = {
  dark: {
    '--color-bg-down': '#2C3038',
    '--color-bg-tr': '#1b1e2d',
    '--color-border-td': '#33373f',
    '--color-bg-code': '#2c3038',
    '--color-code-text-base': '#b9bbc0',
    '--color-code-text-1': '#d36873',
    '--color-code-text-2': '#a084d7',
    '--color-code-text-3': '#44a145',
    '--color-code-text-4': '#78b6fd',
    '--color-prettylights-syntax-comment': '#8b949e',
    '--color-prettylights-syntax-constant': '#79c0ff',
    '--color-prettylights-syntax-entity': '#d2a8ff',
    '--color-prettylights-syntax-storage-modifier-import': '#c9d1d9',
    '--color-prettylights-syntax-entity-tag': '#7ee787',
    '--color-prettylights-syntax-keyword': '#ff7b72',
    '--color-prettylights-syntax-string': '#a5d6ff',
    '--color-prettylights-syntax-variable': '#ffa657',
    '--color-prettylights-syntax-brackethighlighter-unmatched': '#f85149',
    '--color-prettylights-syntax-invalid-illegal-text': '#f0f6fc',
    '--color-prettylights-syntax-invalid-illegal-bg': '#8e1519',
    '--color-prettylights-syntax-carriage-return-text': '#f0f6fc',
    '--color-prettylights-syntax-carriage-return-bg': '#b62324',
    '--color-prettylights-syntax-string-regexp': '#7ee787',
    '--color-prettylights-syntax-markup-list': '#f2cc60',
    '--color-prettylights-syntax-markup-heading': '#1f6feb',
    '--color-prettylights-syntax-markup-italic': '#c9d1d9',
    '--color-prettylights-syntax-markup-bold': '#c9d1d9',
    '--color-prettylights-syntax-markup-deleted-text': '#ffdcd7',
    '--color-prettylights-syntax-markup-deleted-bg': '#67060c',
    '--color-prettylights-syntax-markup-inserted-text': '#aff5b4',
    '--color-prettylights-syntax-markup-inserted-bg': '#033a16',
    '--color-prettylights-syntax-markup-changed-text': '#ffdfb6',
    '--color-prettylights-syntax-markup-changed-bg': '#5a1e02',
    '--color-prettylights-syntax-markup-ignored-text': '#c9d1d9',
    '--color-prettylights-syntax-markup-ignored-bg': '#1158c7',
    '--color-prettylights-syntax-meta-diff-range': '#d2a8ff',
    '--color-prettylights-syntax-brackethighlighter-angle': '#8b949e',
    '--color-prettylights-syntax-sublimelinter-gutter-mark': '#484f58',
    '--color-prettylights-syntax-constant-other-reference-link': '#a5d6ff',
    '--color-fg-default': '#c9d1d9',
    '--color-fg-muted': '#8b949e',
    '--color-fg-subtle': '#484f58',
    '--color-canvas-default': '#0d1117',
    '--color-canvas-subtle': '#161b22',
    '--color-border-default': '#30363d',
    '--color-border-muted': '#21262d',
    '--color-neutral-muted': 'rgba(110, 118, 129, 0.4)',
    '--color-accent-fg': '#58a6ff',
    '--color-accent-emphasis': '#1f6feb',
    '--color-attention-subtle': 'rgba(187, 128, 9, 0.15)',
    '--color-danger-fg': '#f85149',
    '--color-gray-bg-md': '#1e1f2a',
    '--color-gray-md': '#20222d',
  },
  light: {
    '--color-bg-down': '#F8F8F8',
    '--color-border-td': '#f2f2f4',
    '--color-bg-tr': '#f9fafb',
    '--color-bg-code': '#f7f9fb',
    '--color-code-text-base': '#404349',
    '--color-code-text-1': '#d4606c',
    '--color-code-text-2': '#8561ca',
    '--color-code-text-3': '#44a145',
    '--color-code-text-4': '#408ae0',
    '--color-prettylights-syntax-comment': '#6e7781',
    '--color-prettylights-syntax-constant': '#0550ae',
    '--color-prettylights-syntax-entity': '#8250df',
    '--color-prettylights-syntax-storage-modifier-import': '#24292f',
    '--color-prettylights-syntax-entity-tag': '#116329',
    '--color-prettylights-syntax-keyword': '#cf222e',
    '--color-prettylights-syntax-string': '#0a3069',
    '--color-prettylights-syntax-variable': '#953800',
    '--color-prettylights-syntax-brackethighlighter-unmatched': '#82071e',
    '--color-prettylights-syntax-invalid-illegal-text': '#f6f8fa',
    '--color-prettylights-syntax-invalid-illegal-bg': '#82071e',
    '--color-prettylights-syntax-carriage-return-text': '#f6f8fa',
    '--color-prettylights-syntax-carriage-return-bg': '#cf222e',
    '--color-prettylights-syntax-string-regexp': '#116329',
    '--color-prettylights-syntax-markup-list': '#3b2300',
    '--color-prettylights-syntax-markup-heading': '#0550ae',
    '--color-prettylights-syntax-markup-italic': '#24292f',
    '--color-prettylights-syntax-markup-bold': '#24292f',
    '--color-prettylights-syntax-markup-deleted-text': '#82071e',
    '--color-prettylights-syntax-markup-deleted-bg': '#ffebe9',
    '--color-prettylights-syntax-markup-inserted-text': '#116329',
    '--color-prettylights-syntax-markup-inserted-bg': '#dafbe1',
    '--color-prettylights-syntax-markup-changed-text': '#953800',
    '--color-prettylights-syntax-markup-changed-bg': '#ffd8b5',
    '--color-prettylights-syntax-markup-ignored-text': '#eaeef2',
    '--color-prettylights-syntax-markup-ignored-bg': '#0550ae',
    '--color-prettylights-syntax-meta-diff-range': '#8250df',
    '--color-prettylights-syntax-brackethighlighter-angle': '#57606a',
    '--color-prettylights-syntax-sublimelinter-gutter-mark': '#8c959f',
    '--color-prettylights-syntax-constant-other-reference-link': '#0a3069',
    '--color-fg-default': '#24292f',
    '--color-fg-muted': '#57606a',
    '--color-fg-subtle': '#6e7781',
    '--color-canvas-default': '#ffffff',
    '--color-canvas-subtle': '#f6f8fa',
    '--color-border-default': '#d0d7de',
    '--color-border-muted': 'hsla(210, 18%, 87%, 1)',
    '--color-neutral-muted': 'rgba(175, 184, 193, 0.2)',
    '--color-accent-fg': '#0969da',
    '--color-accent-emphasis': '#0969da',
    '--color-attention-subtle': '#fff8c5',
    '--color-danger-fg': '#cf222e',
    '--color-gray-bg-md': '#f9fafb',
    '--color-gray-md': '#f2f4f7',
  },
};
export const ByteMdWrap = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  width: 100%;
  height: 100%;

  .admonition {
    margin: 16px 0;
    padding: 14px 10px;
    overflow: hidden;
    border-radius: 8px;

    p {
      margin: 0 !important;
    }

    &-content {
      padding-left: 24px;
    }

    .admonition-title {
      display: flex;
      align-items: center;
      margin-bottom: 4px !important;
      font-size: 16px !important;
      font-weight: 600;
    }

    &-heading {
      display: block;
      margin-top: 0;
      padding: 0;
      height: auto;

      h5 {
        margin: 0 !important;
        padding: 0;
        height: auto;
        overflow: hidden;
        font-size: var(--font-size-14) !important;
        line-height: 20px;
      }

      .admonition-icon {
        margin-right: 10px;
      }
    }

    &-info {
      display: block;
      border-color: ${admonitionColorInfo};
      background: rgb(58 170 231 / 10%);

      .admonition-heading {
        color: ${admonitionColorInfo};

        .admonition-icon {
          display: inline-block;
          vertical-align: middle;

          /* margin-top: 3px; */

          /* width: 16px; */

          /* height: 16px; */
          content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzY4N180NjM1MSkiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgMTcuNWE3LjUgNy41IDAgMTAwLTE1IDcuNSA3LjUgMCAwMDAgMTV6bTkuMTY3LTcuNUE5LjE2NyA5LjE2NyAwIDExLjgzMyAxMGE5LjE2NyA5LjE2NyAwIDAxMTguMzM0IDB6TTEwIDE0LjE2NmEuODMzLjgzMyAwIDAxLS44MzMtLjgzM1YxMGEuODMzLjgzMyAwIDExMS42NjYgMHYzLjMzM2MwIC40Ni0uMzczLjgzMy0uODMzLjgzM3ptLjgzMy03LjVjMCAuNDYtLjM3My44MzQtLjgzMy44MzRoLS4wMDhhLjgzMy44MzMgMCAwMTAtMS42NjdIMTBjLjQ2IDAgLjgzMy4zNzMuODMzLjgzM3oiIGZpbGw9IiMxODkwRkYiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMF82ODdfNDYzNTEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMjB2MjBIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=');
        }
      }

      /* code {
        border-color: ${admonitionColorInfo};
        color: ${admonitionColorInfo};
        background: rgb(58 170 231 / 10%);
      } */
    }

    &-tip {
      display: block;
      border-color: ${admonitionColorTip};
      background: rgb(43 172 14 / 10%);

      code {
        border-color: ${admonitionColorTip};
        color: ${admonitionColorTip};
        background: rgb(43 172 14 / 10%);
      }

      .admonition-heading {
        color: ${admonitionColorTip};

        .admonition-icon {
          display: inline-block;
          vertical-align: middle;
          content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy44MDYgMS43ODRjLjI0NC0uMTEuNTk4LS4yNTEuOTgtLjIwNWExLjYyIDEuNjIgMCAwMTEuMTUzLjY4NWMuMjIuMzA4LjI2OC42NzIuMjg5LjkzNi4wMjIuMjc4LjAyMi42MzIuMDIyIDEuMDM4djguMTljMCAuNDA3IDAgLjc2LS4wMjIgMS4wMzktLjAyLjI2My0uMDcuNjI4LS4yOS45MzVhMS42MiAxLjYyIDAgMDEtMS4xNTIuNjg1Yy0uMzgyLjA0Ny0uNzM2LS4wOTUtLjk4LS4yMDUtLjI2NS0uMTItLjU5Mi0uMjk4LS45NzItLjUwNWwtLjAzLS4wMTZjLTEuMzA2LS43MTItMi44NC0xLjM2OC00LjA1NC0xLjQzOHYyLjczN2MwIC4xNTggMCAuMjk1LS4wMTIuNDE4YTIuNSAyLjUgMCAwMS0yLjI0MyAyLjI0MyA0LjQxIDQuNDEgMCAwMS0uNDE4LjAxMmgtLjA3Yy0uMTU5IDAtLjI5NSAwLS40MTktLjAxMmEyLjUgMi41IDAgMDEtMi4yNDMtMi4yNDMgNC4zOTUgNC4zOTUgMCAwMS0uMDEyLS40MTh2LTIuNzU0YTUuNzMyIDUuNzMyIDAgMDEtLjEzNS0uMDA3IDIuNTU2IDIuNTU2IDAgMDEtLjgyMS0uMTczIDIuNSAyLjUgMCAwMS0xLjM1My0xLjM1MyAyLjU1NyAyLjU1NyAwIDAxLS4xNzMtLjgyMUMuODMzIDEwLjI5LjgzMyA5Ljk3NS44MzMgOS42MVY4LjU0OWMwLS42NzEgMC0xLjIyNS4wMzctMS42NzYuMDM4LS40NjguMTItLjg5OS4zMjctMS4zMDMuMzItLjYyNy44My0xLjEzNyAxLjQ1Ni0xLjQ1Ny40MDUtLjIwNi44MzUtLjI4OCAxLjMwNC0uMzI2LjQ1LS4wMzcgMS4wMDQtLjAzNyAxLjY3NS0uMDM3aDIuOTFjMS4yNDIgMCAyLjg4LS42OSA0LjI2My0xLjQ0NWwuMDI5LS4wMTZjLjM4LS4yMDcuNzA3LS4zODUuOTcyLS41MDV6bS42ODUgMS41MmMtLjIuMDktLjQ3MS4yMzctLjg4OS40NjUtMS4zOTUuNzYtMy4zNTkgMS42NDgtNS4wNiAxLjY0OEg1LjY2N2MtLjcxNCAwLTEuMiAwLTEuNTc0LjAzLS4zNjYuMDMtLjU1My4wODUtLjY4My4xNTFhMS42NiAxLjY2IDAgMDAtLjcyOC43MjljLS4wNjcuMTMtLjEyLjMxNy0uMTUuNjgyLS4wMzEuMzc1LS4wMzIuODYtLjAzMiAxLjU3NHYxYzAgLjQgMCAuNjU4LjAxNC44NTUuMDEzLjE5LjAzNS4yNjMuMDUuMjk3YS44MzMuODMzIDAgMDAuNDUuNDUxLjk2My45NjMgMCAwMC4yOTguMDVjLjE5Ny4wMTMuNDU1LjAxNC44NTUuMDE0LjQ2IDAgLjgzMy4zNzMuODMzLjgzM3YzLjU0MmMwIC4yMTMuMDAxLjI2LjAwNC4yOWEuODMzLjgzMyAwIDAwLjc0OC43NDhjLjAzLjAwMy4wNzYuMDAzLjI5LjAwMy4yMTMgMCAuMjYgMCAuMjktLjAwM2EuODMzLjgzMyAwIDAwLjc0Ny0uNzQ4IDMuOTMgMy45MyAwIDAwLjAwNC0uMjl2LTMuNTQyYzAtLjQ2LjM3My0uODMzLjgzNC0uODMzaC42MjVjMS43MDEgMCAzLjY2NS44ODcgNS4wNiAxLjY0OC40MTguMjI4LjY5LjM3NS44OS40NjVsLjA3LjAzLjAwNS0uMDU4Yy4wMTYtLjIwNC4wMTYtLjQ5LjAxNi0uOTRWNC4yNzJhMTMuNzUyIDEzLjc1MiAwIDAwLS4wMjItLjk5OWwtLjA3LjAzeiIgZmlsbD0iIzUyQzQxQSIvPjxwYXRoIGQ9Ik0xOC4zMzMgNS44MzNjLjQ2IDAgLjgzNC4zNzMuODM0LjgzNFYxMGEuODMzLjgzMyAwIDAxLTEuNjY3IDBWNi42NjdjMC0uNDYuMzczLS44MzQuODMzLS44MzR6IiBmaWxsPSIjNTJDNDFBIi8+PC9zdmc+');
        }
      }
    }

    &-note {
      display: block;
      border-color: ${admonitionColorNote};
      background: rgb(147 115 238 / 10%);

      /* code {
        border-color: ${admonitionColorNote};
        color: ${admonitionColorNote};
        background: rgb(147 115 238 / 10%);
      } */

      .admonition-heading {
        color: ${admonitionColorNote};

        .admonition-icon {
          display: inline-block;
          vertical-align: middle;
          content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi42NDMgMi42NDNhMy4zMzMgMy4zMzMgMCAxMTQuNzE0IDQuNzE1IDMuMzMzIDMuMzMzIDAgMDEtNC43MTQtNC43MTV6bTMuNTM1IDEuMTc5YTEuNjY3IDEuNjY3IDAgMTAtMi4zNTcgMi4zNTcgMS42NjcgMS42NjcgMCAwMDIuMzU3LTIuMzU3eiIgZmlsbD0iIzkzNzNFRSIvPjxwYXRoIGQ9Ik02LjQ2NiAyLjVoMi43YS44MzMuODMzIDAgMDEwIDEuNjY3SDYuNWMtLjcxNCAwLTEuMiAwLTEuNTc0LjAzMS0uMzY2LjAzLS41NTIuMDg0LS42ODMuMTVhMS42NyAxLjY3IDAgMDAtLjcyOC43MjljLS4wNjYuMTMtLjEyLjMxNy0uMTUuNjgzLS4wMzEuMzc1LS4wMzIuODYtLjAzMiAxLjU3NFYxMy41YzAgLjcxNCAwIDEuMi4wMzIgMS41NzUuMDMuMzY1LjA4NC41NTIuMTUuNjgyLjE2LjMxNC40MTUuNTY5LjcyOC43MjguMTMuMDY3LjMxNy4xMi42ODMuMTUuMzc1LjAzMS44Ni4wMzIgMS41NzQuMDMyaDYuMTY3Yy43MTMgMCAxLjE5OSAwIDEuNTc0LS4wMzEuMzY1LS4wMy41NTItLjA4NC42ODItLjE1LjMxNC0uMTYuNTY5LS40MTUuNzI5LS43MjkuMDY2LS4xMy4xMi0uMzE3LjE1LS42ODIuMDMtLjM3Ni4wMzEtLjg2LjAzMS0xLjU3NXYtMi42NjZhLjgzMy44MzMgMCAxMTEuNjY3IDB2Mi43YzAgLjY3MiAwIDEuMjI1LS4wMzcgMS42NzYtLjAzOC40NjktLjEyLjktLjMyNiAxLjMwNGEzLjMzMyAzLjMzMyAwIDAxLTEuNDU3IDEuNDU2Yy0uNDA1LjIwNi0uODM1LjI4OS0xLjMwMy4zMjctLjQ1Mi4wMzctMS4wMDUuMDM3LTEuNjc2LjAzN0g2LjQ2NmMtLjY3MSAwLTEuMjI1IDAtMS42NzYtLjAzNy0uNDY4LS4wMzgtLjg5OS0uMTItMS4zMDMtLjMyN2EzLjMzMyAzLjMzMyAwIDAxLTEuNDU3LTEuNDU2Yy0uMjA2LS40MDUtLjI4OC0uODM1LS4zMjctMS4zMDQtLjAzNi0uNDUtLjAzNi0xLjAwNC0uMDM2LTEuNjc1VjcuMjk5YzAtLjY3IDAtMS4yMjQuMDM2LTEuNjc1LjAzOS0uNDY5LjEyLS45LjMyNy0xLjMwNC4zMi0uNjI3LjgzLTEuMTM3IDEuNDU3LTEuNDU2LjQwNC0uMjA2LjgzNS0uMjg5IDEuMzAzLS4zMjdDNS4yNDEgMi41IDUuNzk1IDIuNSA2LjQ2NiAyLjV6IiBmaWxsPSIjOTM3M0VFIi8+PHBhdGggZD0iTTUgMTAuODM0YzAtLjQ2LjM3My0uODM0LjgzMy0uODM0SDEyLjVhLjgzMy44MzMgMCAwMTAgMS42NjdINS44MzNBLjgzMy44MzMgMCAwMTUgMTAuODM0em0wIDMuMzMzYzAtLjQ2LjM3My0uODMzLjgzMy0uODMzaDVhLjgzMy44MzMgMCAwMTAgMS42NjZoLTVBLjgzMy44MzMgMCAwMTUgMTQuMTY3eiIgZmlsbD0iIzkzNzNFRSIvPjwvc3ZnPg==');
        }
      }
    }

    &-caution {
      display: block;
      border-color: ${admonitionColorCaution};
      background: rgb(255 160 0 / 10%);

      code {
        border-color: ${admonitionColorCaution};
        color: ${admonitionColorCaution};
        background: rgb(255 160 0 / 10%);
      }

      .admonition-heading {
        color: ${admonitionColorCaution};

        .admonition-icon {
          display: inline-block;
          vertical-align: middle;
          content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04Ljc3MyAxLjA3YTIuNSAyLjUgMCAwMTMuMzY0Ljg4MWwuMDAzLjAwNCA3LjA1OCAxMS43ODMuMDA3LjAxMmEyLjUgMi41IDAgMDEtMi4xMzggMy43NUgyLjkzMmEyLjUgMi41IDAgMDEtMi4xMzctMy43NWwuMDA3LS4wMTIgNy4wNi0xMS43ODdhMi41IDIuNSAwIDAxLjkxMS0uODgyek0xMCAyLjQxM2EuODMzLjgzMyAwIDAwLS43MTIuNEwyLjIzNSAxNC41ODhhLjgzMy44MzMgMCAwMC43MTIgMS4yNDVoMTQuMTA2YS44MzQuODM0IDAgMDAuNzExLTEuMjQ1TDEwLjcxMiAyLjgxNXYtLjAwMWEuODMzLjgzMyAwIDAwLS43MTItLjR6bTAgMy40MmMuNDYgMCAuODMzLjM3Mi44MzMuODMzVjEwYS44MzMuODMzIDAgMTEtMS42NjYgMFY2LjY2N2MwLS40Ni4zNzMtLjgzNC44MzMtLjgzNHptLS44MzMgNy41YzAtLjQ2MS4zNzMtLjgzNC44MzMtLjgzNGguMDA4YS44MzMuODMzIDAgMDEwIDEuNjY2SDEwYS44MzMuODMzIDAgMDEtLjgzMy0uODMzeiIgZmlsbD0iI0ZBOEMxNiIvPjwvc3ZnPg==');
        }
      }
    }

    &-danger,
    &-warning {
      display: block;
      border-color: ${admonitionColorDanger};
      background: rgb(221 66 90 / 10%);

      .admonition-heading {
        color: ${admonitionColorDanger};

        .admonition-icon {
          display: inline-block;
          vertical-align: middle;
          content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzY4N180NjM1NikiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAgMi41YTcuNSA3LjUgMCAxMDAgMTUgNy41IDcuNSAwIDAwMC0xNXpNLjgzMyAxMGE5LjE2NyA5LjE2NyAwIDExMTguMzM0IDBBOS4xNjcgOS4xNjcgMCAwMS44MzMgMTB6bTYuMDc4LTMuMDlhLjgzMy44MzMgMCAwMTEuMTc4IDBMMTAgOC44MjNsMS45MS0xLjkxMWEuODMzLjgzMyAwIDExMS4xOCAxLjE3OEwxMS4xNzggMTBsMS45MSAxLjkxYS44MzMuODMzIDAgMDEtMS4xNzggMS4xOEwxMCAxMS4xNzhsLTEuOTEgMS45MWEuODMzLjgzMyAwIDExLTEuMTgtMS4xNzhMOC44MjMgMTAgNi45MSA4LjA4OGEuODMzLjgzMyAwIDAxMC0xLjE3OHoiIGZpbGw9IiNGRjRENEYiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMF82ODdfNDYzNTYiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMjB2MjBIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=');
        }
      }
    }

    .admonition-tip .admonition-info {
      border-color: ${admonitionColorInfo};
      background: rgb(58 170 231 / 10%);
    }
  }

  .light-block {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 16px 0;
    padding: 14px 10px;
    border-radius: 8px;
    border: 1px solid #eaecf0;
    font-size: 14px;
    line-height: 1.25;

    &-icon {
      line-height: 1.34;
    }

    &-content {
      flex: 1;
      padding-left: 12px;
    }

    &-purple {
      border-color: rgb(147 115 238 / 16%);
      background: rgb(147 115 238 / 8%);
    }

    &-yellow {
      border-color: rgb(250 219 20 / 40%);
      background: rgb(250 219 20 / 8%);
    }

    &-orange {
      border-color: rgb(250 140 22 / 16%);
      background: rgb(250 140 22 / 8%);
    }

    &-red {
      border-color: rgb(255 77 79 / 16%);
      background: rgb(255 77 79 / 8%);
    }

    &-blue {
      border-color: rgb(24 144 255 / 16%);
      background: rgb(24 144 255 / 8%);
    }

    &-green {
      border-color: rgb(76 175 80 / 16%);
      background: rgb(76 175 80 / 8%);
    }

    &-gray {
      border-color: var(--color-border);
      color: var(--font-content-color);
      background: var(--color-bg-right);
    }

    p {
      margin-top: 0;
      margin-bottom: 0 !important;
      line-height: 1.34;
    }
  }

  .bytemd-mermaid {
    .messageText {
      fill: var(--font-content-color) !important;
    }
  }

  .apipost-mark-down {
    & > div {
      height: 100%;
    }

    .bytemd {
      height: 100%;
      border-radius: var(--border-radius);
      border: 1px solid var(--color-table-border);
      background-color: transparent;
      color: var(--font-light-color);
      .bytemd-dropdown{
      max-height: 350px;
      overflow: visible;
      }
      .bytemd-sidebar {
        h2 {
          margin: 14px 0 16px;
        }

        .bytemd-sidebar-close {
          svg {
            font-size: var(--font-size-12);
          }

          &:hover {
            color: var(--color-primary);
          }
        }
      }

      .bytemd-toolbar {
        height: 32px;
        border-bottom: none;
        background-color: var(--color-bg-gray);

        .bytemd-toolbar-icon {
          color: var(--font-content-color);
        }

        .bytemd-toolbar-icon:hover {
          opacity: 0.8;
          background-color: var(--highlight-change-color);
        }
        .tippy-content{
          overflow: hidden;
        }
        .bytemd-toolbar-left {
          .tippy-box {
            background-color: var(--popover-select-bg-color);
            box-shadow: rgba(255, 255, 255, 0.72) 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 16px 24px -8px;
            .bytemd-dropdown-item {
              color: var(--font-content-color);

              &:hover {
                background-color: var(--popover-select-bg-hover-color);
              }
            }
          }
        }

        .bytemd-toolbar-right {
          & > div:last-child,
          & > div:first-child{
            display: none;
          }
        }
      }

      .bytemd-status {
        height: 24px;
        border-top: 1px solid var(--color-table-border);
        color: var(--font-content-color);

        .bytemd-status-right {
          span {
            color: var(--font-content-color);

            &:hover {
              color: var(--color-primary);
            }
          }

          input[type='checkbox'] {
            margin-top: -2px;
            width: 14px;
            height: 14px;
            border-radius: var(--border-radius);
            border: var(--color-border) solid 1px;
            background: #fff0;
            cursor: pointer;
            appearance: none;
          }

          input[type='checkbox']:checked {
            display: inline-block;
            position: relative;
            width: 14px;
            height: 14px;
            background-color: var(--color-primary);
          }

          input[type='checkbox']:checked::after {
            display: inline-block;
            position: absolute;
            top: 1.5px;
            left: 4px;
            transform: rotate(230deg);
            width: 4.5px;
            height: 8px;
            border-top: 2px solid #fff;
            border-left: 2px solid #fff;
            background-color: var(--color-primary);
            content: '';
          }
        }
      }

      .bytemd-body {
        .cm-s-default {
          color: var(--font-title-color);
          background-color: transparent;

          .cm-header {
            color: var(--color-info);
          }

          .cm-string {
            color: #d4606c;
          }

          .cm-link {
            color: var(--color-info);
          }

          .cm-variable-2 {
            color: var(--color-info);
          }

          .CodeMirror-cursors {
            .CodeMirror-cursor {
              border-color: var(--font-content-color);
            }
          }
        }
      }
    }

    .bytemd-split {
      .bytemd-preview {
        border-left: 1px solid var(--color-table-border);
      }

      del {
        text-decoration: line-through;
      }
    }

    .bytemd-fullscreen.bytemd {
      z-index: 1999;
      background-color: var(--color-bg-right);
    }

    .move-fullbar {
      .bytemd-fullscreen {
        padding-top: 50px;
      }
    }
  }
`;
export const ThemeModeWrap = styled.div<{ theme_mode: string }>`
  width: 100%;
  height: 100%;

  .markdown-body {
    padding: 12px !important;
    width: 100%;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji';
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-default']};
    text-size-adjust: 100%;
    word-wrap: break-word;

    ul {
      li {
        list-style: disc;
      }
    }

    ol {
      li {
        list-style: auto;
      }
    }

    .octicon {
      display: inline-block;
      overflow: visible !important;
      vertical-align: text-bottom;
      fill: currentcolor;
    }

    h1:hover .anchor .octicon-link::before,
    h2:hover .anchor .octicon-link::before,
    h3:hover .anchor .octicon-link::before,
    h4:hover .anchor .octicon-link::before,
    h5:hover .anchor .octicon-link::before,
    h6:hover .anchor .octicon-link::before {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-color: currentcolor;
      content: ' ';
      mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
    }

    details,
    figcaption,
    figure {
      display: block;
    }

    summary {
      display: list-item;
    }

    [hidden] {
      display: none !important;
    }

    a {
      text-decoration: none;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-accent-fg']};
      background-color: transparent;
      cursor: pointer;
    }

    a:active,
    a:hover {
      outline-width: 0;
    }

    abbr[title] {
      border-bottom: none;
      text-decoration: underline dotted;
    }

    b,
    strong {
      font-weight: 600;
    }

    dfn {
      font-style: italic;
    }

    h1 {
      margin: 0.67em 0;
      padding-bottom: 0.3em;
      border-bottom: 1px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-muted']};
      font-size: 2em;
      font-weight: 600;
    }

    mark {
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-attention-subtle']};
    }

    small {
      font-size: 90%;
    }

    sub,
    sup {
      position: relative;
      font-size: 75%;
      line-height: 0;
      vertical-align: baseline;
    }

    sub {
      bottom: -0.25em;
    }

    sup {
      top: -0.5em;
    }

    img {
      max-width: 100%;
      border-style: none;
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-canvas-default']};
      box-sizing: content-box;
    }

    code,
    kbd,
    pre,
    samp {
      font-family: monospace;
      font-size: 1em;
    }

    figure {
      margin: 1em 40px;
    }

    hr {
      margin: 24px 0;
      padding: 0;
      height: 0.25em;
      overflow: hidden;
      border: 0;
      border-bottom: 1px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-muted']};
      background: transparent;
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-default']};
      box-sizing: content-box;
    }

    input {
      margin: 0;
      overflow: visible;
      font: inherit;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    [type='button'],
    [type='reset'],
    [type='submit'] {
      appearance: button;
    }

    [type='button']::-moz-focus-inner,
    [type='reset']::-moz-focus-inner,
    [type='submit']::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }

    [type='button']:-moz-focusring,
    [type='reset']:-moz-focusring,
    [type='submit']:-moz-focusring {
      outline: 1px dotted ButtonText;
    }

    [type='checkbox'],
    [type='radio'] {
      box-sizing: border-box;
      padding: 0;
    }

    [type='number']::-webkit-inner-spin-button,
    [type='number']::-webkit-outer-spin-button {
      height: auto;
    }

    [type='search'] {
      appearance: textfield;
      outline-offset: -2px;
    }

    [type='search']::-webkit-search-cancel-button,
    [type='search']::-webkit-search-decoration {
      appearance: none;
    }

    ::-webkit-file-upload-button {
      appearance: button;
      font: inherit;
    }

    a:hover {
      text-decoration: underline;
    }

    hr::before {
      display: table;
      content: '';
    }

    hr::after {
      display: table;
      clear: both;
      content: '';
    }

    table {
      display: table;
      width: 100%;
      max-width: 100%;
      overflow: auto;
      overflow: hidden;
      border-radius: 4px;
      border-collapse: collapse;
      border-spacing: 0;
    }

    td,
    th {
      padding: 0;
    }

    details summary {
      cursor: pointer;
    }

    > *:first-child {
      margin-top: 0 !important;
    }

    > *:last-child {
      margin-bottom: 0 !important;
    }

    details:not([open]) > *:not(summary) {
      display: none !important;
    }

    kbd {
      display: inline-block;
      padding: 3px 5px;
      border-radius: 6px;
      border: solid 1px ${({ theme_mode }) => mdTheme[theme_mode]['--color-neutral-muted']};
      border-bottom-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-neutral-muted']};
      font:
        11px ui-monospace,
        SFMono-Regular,
        'SF Mono',
        Menlo,
        Consolas,
        'Liberation Mono',
        monospace;
      line-height: 10px;
      vertical-align: middle;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-default']};
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-canvas-subtle']};
      box-shadow: inset 0 -1px 0 ${({ theme_mode }) => mdTheme[theme_mode]['--color-neutral-muted']};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      line-height: 1.25;
      font-weight: 600;
    }

    h2 {
      padding-bottom: 0.3em;
      border-bottom: 1px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-muted']};
      font-size: 1.5em;
      font-weight: 600;
    }

    h3 {
      font-size: 1.25em;
      font-weight: 600;
    }

    h4 {
      font-size: 1em;
      font-weight: 600;
    }

    h5 {
      font-size: 0.875em;
      font-weight: 600;
    }

    h6 {
      font-size: 0.85em;
      font-weight: 600;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-muted']};
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
    }

    blockquote {
      margin: 0;
      padding: 1em;
      border-radius: var(--border-radius);
      border-left: 0.25em solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-default']};
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-muted']};
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-bg-code']};
    }

    ul,
    ol {
      margin-top: 0;
      margin-bottom: 0;
      padding-left: 2em;
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    table,
    pre,
    details {
      margin-top: 0;
      margin-bottom: 16px;
    }

    ol ol,
    ul ol {
      list-style-type: lower-roman;
    }

    ul ul,
    ul ol,
    ol ol,
    ol ul {
      margin-top: 0;
      margin-bottom: 0;
    }

    ul ul ol,
    ul ol ol,
    ol ul ol,
    ol ol ol {
      list-style-type: lower-alpha;
    }

    dd {
      margin-left: 0;
    }

    tt,
    code {
      margin: 0;
      padding: 0.2em 0.4em;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono',
        monospace;
      font-size: 12px;
      font-size: 85%;
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-neutral-muted']};
    }

    pre {
      position: relative;
      margin-top: 0;
      margin-bottom: 16px;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono',
        monospace;
      font-size: 12px;
      word-wrap: normal;
      pointer-events: none;
    }

    pre::after {
      display: block;
      position: absolute;
      top: 12px;
      right: 12px;
      width: 16px;
      height: 16px;
      background-image: url('/image/copy_code.svg');
      background-size: 100%;
      cursor: pointer;
      content: '';
      pointer-events: auto;
    }

    pre.success::after {
      background-image: url('/image/copy_code_success.svg');
    }

    ::placeholder {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-subtle']};
      opacity: 1;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      margin: 0;
      appearance: none;
    }

    .pl-c {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-comment']};
    }

    .pl-v,
    .pl-smw {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-variable']};
    }

    .pl-c1,
    .pl-s .pl-v {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-constant']};
    }

    .pl-e,
    .pl-en {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-entity']};
    }

    .pl-smi,
    .pl-s .pl-s1 {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-storage-modifier-import']};
    }

    .pl-ent {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-entity-tag']};
    }

    .pl-k {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-keyword']};
    }

    .pl-s,
    .pl-pds,
    .pl-s .pl-pse .pl-s1,
    .pl-sr,
    .pl-sr .pl-cce,
    .pl-sr .pl-sre,
    .pl-sr .pl-sra {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-string']};
    }

    .pl-bu {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-brackethighlighter-unmatched']};
    }

    .pl-ii {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-invalid-illegal-text']};
      background-color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-invalid-illegal-bg']};
    }

    .pl-c2 {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-carriage-return-text']};
      background-color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-carriage-return-bg']};
    }

    .pl-sr .pl-cce {
      font-weight: bold;
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-string-regexp']};
    }

    .pl-ml {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-markup-list']};
    }

    .pl-mh,
    .pl-mh .pl-en,
    .pl-ms {
      font-weight: bold;
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-heading']};
    }

    .pl-mi {
      font-style: italic;
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-italic']};
    }

    .pl-mb {
      font-weight: bold;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-prettylights-syntax-markup-bold']};
    }

    .pl-md {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-deleted-text']};
      background-color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-deleted-bg']};
    }

    .pl-mi1 {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-inserted-text']};
      background-color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-inserted-bg']};
    }

    .pl-mc {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-changed-text']};
      background-color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-changed-bg']};
    }

    .pl-mi2 {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-ignored-text']};
      background-color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-markup-ignored-bg']};
    }

    .pl-mdr {
      font-weight: bold;
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-meta-diff-range']};
    }

    .pl-ba {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-brackethighlighter-angle']};
    }

    .pl-sg {
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-sublimelinter-gutter-mark']};
    }

    .pl-corl {
      text-decoration: underline;
      color: ${({ theme_mode }) =>
        mdTheme[theme_mode]['--color-prettylights-syntax-constant-other-reference-link']};
    }

    [data-catalyst] {
      display: block;
    }

    g-emoji {
      /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
      font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      font-size: 1em;
      line-height: 1;
      font-weight: 400;
      vertical-align: -0.075em;
      font-style: normal !important;
    }

    g-emoji img {
      width: 1em;
      height: 1em;
    }

    &::before {
      display: table;
      content: '';
    }

    &::after {
      display: table;
      clear: both;
      content: '';
    }

    a:not([href]) {
      text-decoration: none;
      color: inherit;
    }

    .absent {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-danger-fg']};
    }

    .anchor {
      float: left;
      margin-left: -20px;
      padding-right: 4px;
      line-height: 1;
    }

    .anchor:focus {
      outline: none;
    }

    blockquote > :first-child {
      margin-top: 0;
    }

    blockquote > :last-child {
      margin-bottom: 0;
    }

    sup > a::before {
      content: '[';
    }

    sup > a::after {
      content: ']';
    }

    h1 .octicon-link,
    h2 .octicon-link,
    h3 .octicon-link,
    h4 .octicon-link,
    h5 .octicon-link,
    h6 .octicon-link {
      visibility: hidden;
      vertical-align: middle;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-default']};
    }

    h1:hover .anchor,
    h2:hover .anchor,
    h3:hover .anchor,
    h4:hover .anchor,
    h5:hover .anchor,
    h6:hover .anchor {
      text-decoration: none;
    }

    h1:hover .anchor .octicon-link,
    h2:hover .anchor .octicon-link,
    h3:hover .anchor .octicon-link,
    h4:hover .anchor .octicon-link,
    h5:hover .anchor .octicon-link,
    h6:hover .anchor .octicon-link {
      visibility: visible;
    }

    h1 tt,
    h1 code,
    h2 tt,
    h2 code,
    h3 tt,
    h3 code,
    h4 tt,
    h4 code,
    h5 tt,
    h5 code,
    h6 tt,
    h6 code {
      padding: 0 0.2em;
      font-size: inherit;
    }

    ul.no-list,
    ol.no-list {
      padding: 0;
      list-style-type: none;
    }

    ol[type='1'] {
      list-style-type: decimal;
    }

    ol[type='a'] {
      list-style-type: lower-alpha;
    }

    ol[type='i'] {
      list-style-type: lower-roman;
    }

    .footnotes ol {
      padding-left: 16px;
    }

    div > ol:not([type]) {
      list-style-type: decimal;
    }

    li > p {
      margin-top: 16px;
    }

    li + li {
      margin-top: 0.25em;
    }

    dl {
      padding: 0;
    }

    dl dt {
      margin-top: 16px;
      padding: 0;
      font-size: 1em;
      font-weight: 600;
      font-style: italic;
    }

    dl dd {
      margin-bottom: 16px;
      padding: 0 16px;
    }

    table th {
      font-weight: 600;
      text-align: left;
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-bg-down']};
      word-break: keep-all;
    }

    table th,
    table td {
      padding: 6px 13px;
      border: 1px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-td']};
      font-size: 12px;
    }

    .csv-data td,
    .csv-data th {
      padding: 5px;
      overflow: hidden;
      font-size: 12px;
      line-height: 1;
      text-align: left;
      white-space: nowrap;
    }

    table tr {
      height: 36px;

      &:hover td {
        background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-bg-down']};
      }
    }

    .csv-data tr {
      border-top: 0;
    }

    table tr:nth-child(2n) {
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-canvas-subtle']};
    }

    table img {
      background-color: transparent;
    }

    img[align='right'] {
      padding-left: 20px;
    }

    img[align='left'] {
      padding-right: 20px;
    }

    .emoji {
      max-width: none;
      vertical-align: text-top;
      background-color: transparent;
    }

    span.frame {
      display: block;
      overflow: hidden;
    }

    span.frame > span {
      display: block;
      float: left;
      margin: 13px 0 0;
      padding: 7px;
      width: auto;
      overflow: hidden;
      border: 1px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-default']};
    }

    span.frame span img {
      display: block;
      float: left;
    }

    span.float-right > span {
      display: block;
      margin: 13px auto 0;
      overflow: hidden;
      text-align: right;
    }

    span.align-right > span {
      display: block;
      margin: 13px 0 0;
      overflow: hidden;
      text-align: right;
    }

    span.float-left span {
      margin: 13px 0 0;
    }

    span.align-center > span {
      display: block;
      margin: 13px auto 0;
      overflow: hidden;
      text-align: center;
    }

    span.frame span span {
      display: block;
      clear: both;
      padding: 5px 0 0;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-default']};
    }

    span.align-center {
      display: block;
      clear: both;
      overflow: hidden;
    }

    span.align-center span img {
      margin: 0 auto;
      text-align: center;
    }

    span.align-right {
      display: block;
      clear: both;
      overflow: hidden;
    }

    span.align-right span img {
      margin: 0;
      text-align: right;
    }

    span.float-left {
      display: block;
      float: left;
      margin-right: 13px;
      overflow: hidden;
    }

    span.float-right {
      display: block;
      float: right;
      margin-left: 13px;
      overflow: hidden;
    }

    code br,
    tt br {
      display: none;
    }

    del code {
      text-decoration: inherit;
    }

    pre code {
      font-size: 100%;
    }

    pre > code {
      margin: 0;
      padding: 0;
      border: 0;
      white-space: pre;
      background: transparent;
      word-break: normal;
    }

    .highlight {
      margin-bottom: 16px;
    }

    pre,
    .highlight pre {
      padding: 12px;
      overflow: auto;
      border-radius: 6px;
      font-size: 85%;
      line-height: 1.45;
      background-color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-bg-code']};
    }

    .highlight pre {
      margin-bottom: 0;
      word-break: normal;
    }

    pre code,
    pre tt {
      display: inline;
      margin: 0;
      padding: 0;
      max-width: auto;
      overflow: visible;
      border: 0;
      line-height: inherit;
      background-color: transparent;
      word-wrap: normal;
    }

    .csv-data .blob-num {
      padding: 10px 8px 9px;
      border: 0;
      text-align: right;
      background: ${({ theme_mode }) => mdTheme[theme_mode]['--color-canvas-default']};
    }

    .csv-data th {
      border-top: 0;
      font-weight: 600;
      background: ${({ theme_mode }) => mdTheme[theme_mode]['--color-canvas-subtle']};
    }

    .footnotes {
      border-top: 1px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-border-default']};
      font-size: 12px;
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-muted']};
    }

    .footnotes li {
      position: relative;
    }

    .footnotes li:target::before {
      position: absolute;
      inset: -8px -8px -8px -24px;
      border-radius: 6px;
      border: 2px solid ${({ theme_mode }) => mdTheme[theme_mode]['--color-accent-emphasis']};
      content: '';
      pointer-events: none;
    }

    .footnotes li:target {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-fg-default']};
    }

    .footnotes .data-footnote-backref g-emoji {
      font-family: monospace;
    }

    .task-list-item {
      list-style-type: none;
    }

    .task-list-item label {
      font-weight: 400;
    }

    .task-list-item.enabled label {
      cursor: pointer;
    }

    .task-list-item + .task-list-item {
      margin-top: 3px;
    }

    .task-list-item .handle {
      display: none;
    }

    .task-list-item-checkbox {
      margin: 0 0.2em 0.25em -1.6em;
      vertical-align: middle;
    }

    .contains-task-list:dir(rtl) .task-list-item-checkbox {
      margin: 0 -1.6em 0.25em 0.2em;
    }

    ::-webkit-calendar-picker-indicator {
      filter: invert(50%);
    }

    > details {
      padding: 14px;
      border-radius: 4px;
      border: 1px solid #23d7ef;
      font-size: 14px;
      line-height: 1.34;
      background: rgb(35 215 239 / 4%);
    }

    > details code {
      margin: 0 8px;
      border-radius: 8px;
      border: 0.5px solid #33e7ff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji';
      font-size: 14px;
      background: rgb(35 215 239 / 10%);
    }

    details[open] > summary {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #23d7ef;
    }

    summary::marker {
      margin-right: 18px;
      color: #23d7ef;
    }

    details[open] > summary::marker {
      color: #23d7ef;
    }

    pre code.hljs {
      display: block;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;

      /* padding: 1em; */
    }

    /* stylelint-disable-next-line no-descending-specificity */
    code.hljs {
      padding: 3px 5px;
    }

    .hljs {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-code-text-base']};
      background: ${({ theme_mode }) => mdTheme[theme_mode]['--color-bg-code']};
    }

    .hljs-comment,
    .hljs-quote {
      color: #969896;
      font-style: italic;
    }

    .hljs-addition,
    .hljs-keyword,
    .hljs-literal,
    .hljs-selector-tag,
    .hljs-type {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-code-text-1']};
    }

    .hljs-number,
    .hljs-selector-attr,
    .hljs-selector-pseudo {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-code-text-4']};
    }

    .hljs-doctag,
    .hljs-regexp,
    .hljs-string {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-code-text-3']};
    }

    /* stylelint-disable-next-line selector-class-pattern */
    .hljs-built_in,
    .hljs-name,
    .hljs-section,
    .hljs-title {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-code-text-2']};
    }

    .hljs-class .hljs-title,
    .hljs-selector-id,
    .hljs-template-variable,
    .hljs-variable {
      color: #ff9801;
    }

    .hljs-name,
    .hljs-section,
    .hljs-strong {
      font-weight: 700;
    }

    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-subst,
    .hljs-symbol {
      color: #f99157;
    }

    .hljs-deletion {
      color: #dc322f;
    }

    .hljs-formula {
      background: #eee8d5;
    }

    .hljs-attr,
    .hljs-attribute {
      color: ${({ theme_mode }) => mdTheme[theme_mode]['--color-code-text-1']};
    }

    .hljs-emphasis {
      font-style: italic;
    }
  }
`;
