import { FC, memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Form, Select } from 'antd';

import { concat, isEqual } from 'lodash';

import { AUTH_ENUM, AUTH_INHERIT_OPTIONS, AUTH_OPTIONS } from '@/constants/apis/auth';
import { ApiRequest } from '@/types/apis/request';
import { ChangeFuncType } from '@/types/common';

import {
  Asap,
  Awsv4,
  Basic,
  Bearer,
  Digest,
  Edgegrid,
  Hawk,
  Jwt,
  Kv,
  Ntlm,
  Oauth1,
} from './components';

import { CheckedStyles, RequestAuthContainer } from './style';

interface Props {
  value: ApiRequest['auth'];
  onChange: ChangeFuncType<ApiRequest>;
  isSystem?: boolean;
}

const RequestAuth: FC<Props> = memo(
  ({ value, onChange, isSystem }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
      form.setFieldsValue(value);
    }, [value]);

    const handleOnChange = (values: Partial<ApiRequest['auth']>) => {
      onChange?.('auth', { ...value, ...values });
    };

    const renderContent = useMemo(() => {
      const authMap = {
        [AUTH_ENUM.KV]: <Kv />,
        [AUTH_ENUM.BEARER]: <Bearer />,
        [AUTH_ENUM.BASIC]: <Basic />,
        [AUTH_ENUM.JWT]: <Jwt />,
        [AUTH_ENUM.DIGEST]: <Digest />,
        [AUTH_ENUM.OAUTH1]: <Oauth1 />,
        [AUTH_ENUM.HAWK]: <Hawk />,
        [AUTH_ENUM.AWSV4]: <Awsv4 />,
        [AUTH_ENUM.NTLM]: <Ntlm />,
        [AUTH_ENUM.EDGEGRID]: <Edgegrid />,
        [AUTH_ENUM.ASAP]: <Asap />,
        [AUTH_ENUM.NOAUTH]: null,
        [AUTH_ENUM.INHERIT]: null,
      };

      return authMap[value?.type as AUTH_ENUM];
    }, [value?.type]);

    const options = useMemo(() => {
      if (isSystem) {
        return AUTH_OPTIONS;
      }
      return concat(AUTH_INHERIT_OPTIONS, AUTH_OPTIONS);
    }, [isSystem]);

    return (
      <RequestAuthContainer>
        <CheckedStyles />
        <Flex justify="center">
          <Form
            colon={false}
            form={form}
            style={{ width: 700 }}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            onValuesChange={(_changedValues, allValues) => handleOnChange(allValues)}
          >
            <Form.Item label={t('common.auth.type')} name="type" initialValue={'noauth'}>
              <Select options={options} />
            </Form.Item>
            <Form.Item noStyle dependencies={['type']}>
              {() => renderContent}
            </Form.Item>
          </Form>
        </Flex>
      </RequestAuthContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RequestAuth;
