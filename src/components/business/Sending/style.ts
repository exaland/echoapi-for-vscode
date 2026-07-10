import styled, { keyframes } from 'styled-components';

const lineLoading = keyframes`
  form {
    left: 0;
  }
  to {
    left: 100%;
  }
`;

export const ResponseSendContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 101;
  color: var(--font-content-color);
  background-color: var(--color-bg-right);
  opacity: 0.9;

  .sending-loading-bar {
    position: absolute;
    top: 0;
    left: 0;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    width: 189px;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary), rgb(255 255 255 / 0%) 100%);
    animation: ${lineLoading} 2s linear infinite;
  }

  .sending-loading-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .sending-loading-content-text {
      margin-bottom: 22px;
    }
  }
`;
