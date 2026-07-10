import styled from 'styled-components';

export const SchemaWrapper = styled.div<{ $token: Partial<GlobalThemeToken> }>`
  display: flex;
  flex-direction: column;

  .apipost-btn {
    padding: 0;
    width: 20px;
    height: 20px;
  }

  .template-table {
    position: relative;
    flex: 1;

    .sel-title {
      font-size: var(--font-size-12);
      text-transform: capitalize;
      color: #43a047;
    }

    .table-tr {
      display: flex;
      height: 32px;

      /* border-top: 1px solid var(--color-border); */

      /* border-right: 1px solid var(--color-border); */

      /* border-left: 1px solid var(--color-border); */

      /* border-left: 1px solid var(--color-border); */

      &:hover {
        background-color: var(--color-bg-page);

        .set-icon {
          visibility: visible !important;
        }

        .ai-icon {
          visibility: visible !important;
        }

        .delete-item-icon {
          visibility: visible !important;
        }
      }

      &.is-hidden {
        background-color: var(--color-bg-page);
      }

      .table-td {
        height: 32px;
        border-top: none;
        border-right: none;
        border-bottom: none;

        /* border-bottom: 1px solid var(--color-border); */
        border-left: none;

        /* flex: 1; */

        /* &:last-child { */

        /* flex: 1; */

        /* } */
      }
    }
    .object-list {
      .object-item {
        &:last-child {
          .table-tr {
            &:last-of-type {
              border-radius: 0 0 4px 4px;

              .empty-btn-r {
                border-left: 0;
              }
            }
          }
        }
      }
    }
    .object-item {
      &:last-child {
        .table-tr {
          // &:last-of-type {
          //   border-radius: 0 0 4px 4px;

          //   .empty-btn-r {
          //     border-left: 0;
          //   }
          // }

          .table-td {
            /* border-radius: 0 0 */
            &:first-child {
              border-radius: 0 0 0 4px;
            }

            &:last-child {
              border-radius: 0 0 0 4px;
            }
          }
        }
      }
    }

    .empty-row-panel {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      align-items: center;
      padding-left: 36px;
      height: 32px;
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      border-left: 1px solid var(--color-border);

      /* border-right: 1px solid transparent; */

      /* border-bottom: 1px solid transparent; */

      /* border-left: 1px solid transparent; */
      color: var(--font-title-color);

      .btn-add-item {
        margin-left: 10px;
        color: var(--color-primary);
        cursor: pointer;
      }

      .empty-row-tip {
        color: var(--font-light-color);
      }
    }

    tr,
    td {
      height: 32px;
      border-collapse: collapse;
    }

    tr:hover {
      background-color: var(--color-bg-page);
    }

    .item-key-types {
      font-size: 12px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .apipost-select-single {
      &:hover {
        .item-key-types {
          text-decoration: underline;
        }
      }
    }

    .is-hidden {
      .schema-text-box,
      .sel-title,
      .item-key-types,
      .apipost-input {
        text-decoration: line-through !important;
        font-size: var(--font-size-12) !important;
        &:hover {
          color: var(--font-title-color);
        }
      }
    }

    tbody {
      & > tr:nth-child(2) {
        border-top: 0;

        td {
          border-top: 0;
        }
      }
    }

    .schema-td {
      padding: 0;
      border: 1px solid #000;

      &-warper {
        display: flex;
        float: left;
        position: relative;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      .td-scale {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 200;
        transform: translateX(-7.5px);
        justify-content: center;
        width: 15px;
        height: 100%;
        cursor: ew-resize;
        content: '';

        &::after {
          visibility: hidden;
          width: 1px;
          height: 100%;
          background-color: var(--color-primary);
          content: '';
        }

        &:hover::after {
          visibility: visible;
        }

        &.scaling::after {
          visibility: visible;
        }
      }
    }
  }
`;
