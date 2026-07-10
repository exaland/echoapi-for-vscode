import { InputNumber as AntdInputNumber, InputNumberProps } from 'antd';

import { MAX_INPUT_NUMBER_LENGTH, MIN_INPUT_NUMBER_LENGTH } from '@/constants/form';

const InputNumber = (props: InputNumberProps) => {
  return <AntdInputNumber max={MAX_INPUT_NUMBER_LENGTH} min={MIN_INPUT_NUMBER_LENGTH} {...props} />;
};

export default InputNumber;
