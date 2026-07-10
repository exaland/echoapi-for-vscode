import { useTranslation } from 'react-i18next';

import { Form } from 'antd';

import VarInput from '@/components/business/VarInput';
import { AUTH_ENUM } from '@/constants/apis/auth';

const Bearer = () => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item label="Token" name={[AUTH_ENUM.BEARER, 'key']}>
        <VarInput
          enableNewRow
          maxLength={10240}
          hasBorder
          placeholder={t('common.auth.token_tip')}
        />
      </Form.Item>
    </>
  );
};

export default Bearer;
