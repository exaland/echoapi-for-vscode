import { FC } from 'react';

import { Form, Input } from 'antd';

import { isObject, keys, map } from 'lodash';

import { AUTH_ENUM, DEFAULT_AUTH } from '@/constants/apis/auth';

interface Props {
  type: AUTH_ENUM;
}

const AuthCommon: FC<Props> = ({ type }) => {
  const result = DEFAULT_AUTH[type];

  if (!isObject(result)) return null;

  return (
    <>
      {map(keys(result), (item) => (
        <Form.Item label={item} name={item} key={item}>
          <Input.TextArea autoSize />
        </Form.Item>
      ))}
    </>
  );
};

export default AuthCommon;
