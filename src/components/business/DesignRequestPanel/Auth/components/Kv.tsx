import { useTranslation } from 'react-i18next';

import { Form, Input, Select } from 'antd';

import { map } from 'lodash';

import VarInput from '@/components/business/VarInput';
import { AUTH_APIKEY_LOCATION, AUTH_ENUM } from '@/constants/apis/auth';

const Kv = () => {
  const { t } = useTranslation();
  const options = map(AUTH_APIKEY_LOCATION, ({ value, label }) => ({
    value,
    label,
  }));
  return (
    <>
      <Form.Item label="Key" name={[AUTH_ENUM.KV, 'key']}>
        <Input.TextArea autoSize placeholder={t('common.auth.key_tip')} />
      </Form.Item>
      <Form.Item label="Value" name={[AUTH_ENUM.KV, 'value']}>
        <VarInput enableNewRow hasBorder placeholder={t('common.auth.value_tip')} />
      </Form.Item>
      <Form.Item initialValue="header" label={t('common.auth.add_to')} name={[AUTH_ENUM.KV, 'in']}>
        <Select options={options} />
      </Form.Item>
    </>
  );
};

export default Kv;
