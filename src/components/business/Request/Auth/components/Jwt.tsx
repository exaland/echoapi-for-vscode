import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Form, Input, Select } from 'antd';

import { map } from 'lodash';

import GhostCollapse from '@/components/ui/GhostCollapse';
import {
  AUTH_ENUM,
  AUTH_INSERT_LOCATION,
  AUTH_INSERT_VALUE,
  JWT_ALGORITHM_OPTIONS,
} from '@/constants/apis/auth';

import CodeEditor from './CodeEditor';

import { MoreTipContainer } from '../style';

const Jwt = () => {
  const { t } = useTranslation();
  const options = useMemo(() => {
    return map(JWT_ALGORITHM_OPTIONS, (e) => ({
      value: e,
      label: e,
    }));
  }, []);
  return (
    <>
      <Form.Item
        initialValue={AUTH_INSERT_VALUE.HEADER}
        label={t('common.auth.add_to')}
        name={[AUTH_ENUM.JWT, 'addTokenTo']}
      >
        <Select options={AUTH_INSERT_LOCATION} />
      </Form.Item>
      <Form.Item initialValue="HS256" label="Algorithm" name={[AUTH_ENUM.JWT, 'algorithm']}>
        <Select options={options} />
      </Form.Item>
      <Form.Item label="Secret" name={[AUTH_ENUM.JWT, 'secret']}>
        <Input.TextArea autoSize />
      </Form.Item>
      <Form.Item valuePropName="checked" noStyle name={[AUTH_ENUM.JWT, 'isSecretBase64Encoded']}>
        <Checkbox className="auth-checked">Secret Base64 encoded</Checkbox>
      </Form.Item>
      <Form.Item label="Payload" name={[AUTH_ENUM.JWT, 'payload']}>
        <CodeEditor />
      </Form.Item>
      <Form.Item noStyle>
        <GhostCollapse
          items={[
            {
              key: 'jwt-more',
              label: <MoreTipContainer>{t('common.auth.more')}</MoreTipContainer>,
              children: (
                <>
                  <span className="auth-tips">{t('common.auth.more_tip')}</span>
                  <Form.Item noStyle dependencies={[AUTH_ENUM.JWT, 'addTokenTo']}>
                    {({ getFieldValue }) => {
                      const location = getFieldValue(AUTH_ENUM.JWT)?.addTokenTo;
                      if (location === AUTH_INSERT_VALUE.HEADER) {
                        return (
                          <Form.Item
                            labelCol={{ span: 6 }}
                            initialValue="Bearer"
                            label="Request header prefix"
                            name={[AUTH_ENUM.JWT, 'headerPrefix']}
                          >
                            <Input.TextArea autoSize />
                          </Form.Item>
                        );
                      }
                      return (
                        <Form.Item
                          labelCol={{ span: 6 }}
                          initialValue="token"
                          label="Query param name"
                          name={[AUTH_ENUM.JWT, 'queryParamKey']}
                        >
                          <Input.TextArea autoSize />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                  <Form.Item label="JWT headers" name={[AUTH_ENUM.JWT, 'header']}>
                    <CodeEditor />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Form.Item>
    </>
  );
};

export default Jwt;
