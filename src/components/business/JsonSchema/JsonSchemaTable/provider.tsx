import React from 'react';

import context from './context';

const ConfigProvider: React.FC<any> = (props) => {
  const { value, children } = props;
  const { Provider } = context;

  return <Provider value={value}>{children}</Provider>;
};

export default React.memo(ConfigProvider);
