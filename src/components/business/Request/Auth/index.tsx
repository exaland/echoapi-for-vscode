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
  Oauth2
} from './components';

import { CheckedStyles, RequestAuthContainer } from './style';
import produce from 'immer';
import { AuthOauth2 } from '@/types/apis/auth';

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

    const oauth2Change = (oauth2: AuthOauth2) => {
      if (value) {
        const newAuth = produce(value, (draft) => {
          draft.oauth2 = {
            ...((draft.oauth2 || {}) as AuthOauth2),
            ...oauth2,
          };
        });
        onChange?.('auth', newAuth);
      }
    };

    const renderContent = useMemo(() => {
      const authMap = {
        [AUTH_ENUM.KV]: <Kv />,
        [AUTH_ENUM.BEARER]: <Bearer />,
        [AUTH_ENUM.BASIC]: <Basic />,
        [AUTH_ENUM.JWT]: <Jwt />,
        [AUTH_ENUM.DIGEST]: <Digest />,
        [AUTH_ENUM.OAUTH1]: <Oauth1 />,
        [AUTH_ENUM.OAUTH2]: <Oauth2 onChange={oauth2Change} />,
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
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
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
