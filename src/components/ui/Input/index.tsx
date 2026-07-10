import { Input as AntdInput, InputProps } from 'antd';

import { MAX_INPUT_LENGTH } from '@/constants/form';

const Input = (props: InputProps) => {
  return <AntdInput maxLength={MAX_INPUT_LENGTH} {...props} />;
};

export default Input;
