import styled from 'styled-components';

export const ResponseErrorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  width: 100%;
  height: 100%;
  background: var(--color-bg-right);

  .close-error-wrapper {
    position: absolute;
    top: 14px;
    right: 16px;
    font-size: 20px;
    color: #ff4c4c;
    cursor: pointer;
  }

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    font-size: var(--font-size-12);
    text-align: center;
    color: var(--font-content-color);

    p.error-str {
      margin: 10px auto;
      padding: 6px 8px;
      width: max-content;
      max-width: 100%;
      border-radius: var(--border-radius);
      font-size: 14px;
      background: rgb(255 88 62 / 10%);
    }

    .error-str.proxy-error {
      background: #fff9df;
    }

    span {
      color: var(--main);
      cursor: pointer;
    }

    .chioce-btn {
      color: #3a86ff;
    }

    .proxy-img {
      margin: 0 0 20px;
    }
  }
`;
