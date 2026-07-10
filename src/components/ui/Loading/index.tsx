import { Spin } from 'antd';

import { LoadingWrapper } from './style';

const Loading = () => {
  return (
    <LoadingWrapper>
      <Spin size="large" />
    </LoadingWrapper>
  );
};

export default Loading;
