import { Tag } from 'antd';

import styled from 'styled-components';

import { flexStyles } from '@/assets/css/style';

export const ApisTypeTag = styled(Tag)`
  height: 24px;
  font-size: 12px;
  ${flexStyles('row', 'center', 'space-between')}

  &.post {
    color: var(--color-warning);
    background-color: var(--color-warning-bg);
  }

  &.get,
  &.api-extra,
  &.socket,
  &.socket-service {
    color: var(--color-success);
    background-color: var(--color-success-bg);
  }

  &.put {
    color: var(--color-info);
    background-color: var(--color-info-bg);
  }

  &.socket,
  &.testing,
  &.kit {
    width: auto;
  }

  &.socket-method,
  &.doc {
    color: var(--color-info);
    background-color: var(--color-info-bg);
  }

  &.delete {
    color: var(--color-error);
    background-color: var(--color-error-bg);
  }

  &.grpc,
  &.ws,
  &.patch {
    color: var(--color-success);
    background-color: var(--color-success-bg);
  }
`;
