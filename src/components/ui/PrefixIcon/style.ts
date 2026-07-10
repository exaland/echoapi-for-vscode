import styled from 'styled-components';

export const PrefixIconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  width: 36px;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--font-size-12);
  font-weight: 700;
  text-align: left;
  color: var(--color-success);

  svg {
    font-size: var(--font-size-14);
  }

  &.post {
    color: var(--color-warning);
  }

  &.DEFAULT {
    color: var(--color-success);
  }

  &.get {
    color: var(--color-success);
  }

  &.put,
  &.socket {
    color: var(--color-info);
  }

  &.socket,
  &.testing,
  &.kit {
    width: auto;
  }

  &.socket-method,
  &.doc {
    color: var(--color-info);
  }

  &.delete {
    color: var(--color-error);
  }

  &.gql {
    color: #f80ba0;
  }

  &.grpc,
  &.ws,
  &.patch {
    color: var(--color-success);
  }

  &.notes {
    width: auto;
    color: rgb(247 179 39 / 100%);
  }

  &.testing {
    color: #067ced;
  }

  &.kit {
    color: #7879f1;
  }

  &.data-model,
  &.api-sample {
    width: auto;
  }

  &.data-model {
    color: #30d4ad;
  }

  &.api-sample {
    color: #4c80ff;
  }

  &.sse {
    color: #65e0ff;
  }
`;
