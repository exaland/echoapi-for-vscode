import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Input, Select } from 'antd';

import { map } from 'lodash';

import GhostCollapse from '@/components/ui/GhostCollapse';
import { AUTH_ENUM, JWT_ALGORITHM_OPTIONS } from '@/constants/apis/auth';

import CodeEditor from './CodeEditor';
import PrivateCom from './PrivateCom';

import { MoreTipContainer } from '../style';

const Asap = () => {
  const { t } = useTranslation();
  const options = useMemo(() => {
    return map(JWT_ALGORITHM_OPTIONS, (e) => ({
      value: e,
      label: e,
    }));
  }, []);
  return (
    <>
      <Form.Item initialValue="HS256" label="Algorithm" name={[AUTH_ENUM.ASAP, 'alg']}>
        <Select options={options} />
      </Form.Item>
      <Form.Item label="issuer" name={[AUTH_ENUM.ASAP, 'iss']}>
        <Input.TextArea autoSize />
      </Form.Item>
      <Form.Item label="Audience" name={[AUTH_ENUM.ASAP, 'aud']}>
        <Input.TextArea autoSize />
      </Form.Item>
      <Form.Item label="Key ID" name={[AUTH_ENUM.ASAP, 'kid']}>
        <Input.TextArea autoSize />
      </Form.Item>
      <Form.Item label="Private Key" name={[AUTH_ENUM.ASAP, 'privateKey']}>
        <PrivateCom />
      </Form.Item>
      <GhostCollapse
        items={[
          {
            key: 'asap-more',
            label: <MoreTipContainer>{t('common.auth.more')}</MoreTipContainer>,
            children: (
              <>
                <Form.Item label="Subject" name={[AUTH_ENUM.ASAP, 'sub']}>
                  <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item label="Additional claims" name={[AUTH_ENUM.ASAP, 'claims']}>
                  <CodeEditor />
                </Form.Item>
                <Form.Item label="Expiry" name={[AUTH_ENUM.ASAP, 'exp']}>
                  <Input.TextArea autoSize />
                </Form.Item>
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default Asap;
