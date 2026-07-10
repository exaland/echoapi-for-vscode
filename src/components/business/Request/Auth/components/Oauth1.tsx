import { useTranslation } from 'react-i18next';

import { Checkbox, Flex, Form, Input, Select } from 'antd';

import { includes, map } from 'lodash';

import GhostCollapse from '@/components/ui/GhostCollapse';
import {
  AUTH_ENUM,
  AUTH_OAUTH_LOCATION,
  OAUTH1_METHODS_OPTIONS,
} from '@/constants/apis/auth';

import PrivateCom from './PrivateCom';

import { MoreTipContainer } from '../style';

const options = map(OAUTH1_METHODS_OPTIONS, (item) => ({
  label: item,
  value: item,
}));

const Encoding = (props: any) => {
  return (
    <Checkbox value={props?.value} onChange={(e) => props?.onChange(!e?.target?.checked)}>
      Encode the parameters in the Authorization header
    </Checkbox>
  );
};

const Oauth1 = () => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item
        initialValue={false}
        label={t('common.auth.add_to')}
        name={[AUTH_ENUM.OAUTH1, 'addParamsToHeader']}
      >
        <Select options={AUTH_OAUTH_LOCATION} />
      </Form.Item>
      <Form.Item label="Signature Method" name={[AUTH_ENUM.OAUTH1, 'signatureMethod']}>
        <Select placeholder={t('common.select_tip')} options={options} />
      </Form.Item>
      <Form.Item label="Consumer Key" name={[AUTH_ENUM.OAUTH1, 'consumerKey']}>
        <Input.TextArea autoSize />
      </Form.Item>
      <Form.Item noStyle dependencies={[AUTH_ENUM.OAUTH1, 'signatureMethod']}>
        {({ getFieldValue }) => {
          const currentMethod = getFieldValue(AUTH_ENUM.OAUTH1)?.signatureMethod;
          const isRSA = includes(['RSA-SHA1', 'RSA-SHA256', 'RSA-SHA512'], currentMethod);

          return (
            <>
              <Form.Item
                label="Consumer Secret"
                name={[AUTH_ENUM.OAUTH1, 'consumerSecret']}
                hidden={isRSA}
              >
                <Input.TextArea autoSize />
              </Form.Item>
              <Form.Item
                label="Token Secret"
                name={[AUTH_ENUM.OAUTH1, 'tokenSecret']}
                hidden={isRSA}
              >
                <Input.TextArea autoSize />
              </Form.Item>
              {/* NOTE RSA has two display types */}
              <Form.Item label="Access Token" name={[AUTH_ENUM.OAUTH1, 'token']} hidden={isRSA}>
                <Input.TextArea autoSize />
              </Form.Item>
              <Form.Item
                label="Private Key"
                name={[AUTH_ENUM.OAUTH1, 'privateKey']}
                hidden={!isRSA}
              >
                <PrivateCom />
              </Form.Item>
            </>
          );
        }}
      </Form.Item>
      <Form.Item noStyle>
        <GhostCollapse
          items={[
            {
              key: 'oauth1-more',
              label: <MoreTipContainer>{t('common.auth.more')}</MoreTipContainer>,
              children: (
                <>
                  <span className="auth-tips">{t('common.auth.more_tip')}</span>
                  <Form.Item label="Callback Url" name={[AUTH_ENUM.OAUTH1, 'callback']}>
                    <Input.TextArea autoSize />
                  </Form.Item>
                  <Form.Item label="Verifier" name={[AUTH_ENUM.OAUTH1, 'verifier']}>
                    <Input.TextArea autoSize />
                  </Form.Item>
                  <Form.Item label="Timestamp" name={[AUTH_ENUM.OAUTH1, 'timestamp']}>
                    <Input.TextArea autoSize />
                  </Form.Item>
                  <Form.Item label="Nonce" name={[AUTH_ENUM.OAUTH1, 'nonce']}>
                    <Input.TextArea autoSize />
                  </Form.Item>
                  <Form.Item label="Version" name={[AUTH_ENUM.OAUTH1, 'version']}>
                    <Input.TextArea autoSize />
                  </Form.Item>
                  <Form.Item label="Realm" name={[AUTH_ENUM.OAUTH1, 'realm']}>
                    <Input.TextArea autoSize />
                  </Form.Item>
                  <Flex vertical gap={8}>
                    <Form.Item
                      noStyle
                      name={[AUTH_ENUM.OAUTH1, 'includeBodyHash']}
                      valuePropName="checked"
                    >
                      <Checkbox>Include body hash</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name={[AUTH_ENUM.OAUTH1, 'addEmptyParamsToSign']}
                      valuePropName="checked"
                    >
                      <Checkbox>Add empty parameters to signature</Checkbox>
                    </Form.Item>
                    <Form.Item noStyle dependencies={[AUTH_ENUM.OAUTH1, 'addParamsToHeader']}>
                      {({ getFieldValue }) => {
                        const addParamsToHeader = getFieldValue(AUTH_ENUM.OAUTH1)
                          ?.addParamsToHeader;
                        if (addParamsToHeader) {
                          return (
                            <Form.Item
                              noStyle
                              name={[AUTH_ENUM.OAUTH1, 'disableHeaderEncoding']}
                              valuePropName="checked"
                            >
                              <Encoding />
                            </Form.Item>
                          );
                        }
                      }}
                    </Form.Item>
                  </Flex>
                </>
              ),
            },
          ]}
        />
      </Form.Item>
    </>
  );
};

export default Oauth1;
