import { FC } from 'react';

import { AlertProps } from 'antd';

import { AlertTextWrap } from './style';

const AlertText: FC<AlertProps> = (props) => {
  return <AlertTextWrap {...props}></AlertTextWrap>;
};
export default AlertText;
