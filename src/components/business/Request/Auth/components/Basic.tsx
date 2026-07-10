import { useTranslation } from 'react-i18next';

import { Form } from 'antd';

import VarInput from '@/components/business/VarInput';
import { AUTH_ENUM } from '@/constants/apis/auth';

const Basic = () => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item label="Username" name={[AUTH_ENUM.BASIC, 'username']}>
        <VarInput enableNewRow hasBorder placeholder={t('common.auth.username_tip')} />
      </Form.Item>
      <Form.Item label="Password" name={[AUTH_ENUM.BASIC, 'password']}>
        <VarInput enableNewRow hasBorder placeholder={t('common.auth.pwd_tip')} />
      </Form.Item>
    </>
  );
};

export default Basic;
