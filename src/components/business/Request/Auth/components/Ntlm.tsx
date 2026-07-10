import { useTranslation } from 'react-i18next';

import { Checkbox, Form, Input } from 'antd';

import { map } from 'lodash';

import GhostCollapse from '@/components/ui/GhostCollapse';
import { AUTH_ENUM } from '@/constants/apis/auth';

import { MoreTipContainer } from '../style';

const fieldList = [
  { label: 'Username', name: 'username', placeholder: 'Username' },
  { label: 'Password', name: 'password', placeholder: 'password' },
];

const moreFieldList = [
  { label: 'Domain', name: 'domain', placeholder: 'e.g. example.com' },
  { label: 'Workstation', name: 'workstation', placeholder: 'e.g. someone-PC' },
];

const Ntlm = () => {
  const { t } = useTranslation();
  return (
    <>
      <span className="auth-tips">{t('common.auth.disable_tip')}</span>
      <Form.Item label="" valuePropName="checked" name={[AUTH_ENUM.NTLM, 'disableRetryRequest']}>
        <Checkbox className="auth-checked">{t('common.auth.disable')}</Checkbox>
      </Form.Item>
      {map(fieldList, (item) => (
        <Form.Item label={item.label} name={[AUTH_ENUM.NTLM, item.name]}>
          <Input.TextArea autoSize placeholder={item.placeholder} />
        </Form.Item>
      ))}
      <GhostCollapse
        items={[
          {
            key: 'hawk-more',
            label: <MoreTipContainer>{t('common.auth.more')}</MoreTipContainer>,
            children: (
              <>
                <span className="auth-tips">{t('common.auth.more_tip')}</span>
                {map(moreFieldList, (item) => (
                  <Form.Item label={item.label} name={[AUTH_ENUM.NTLM, item.name]}>
                    <Input.TextArea autoSize placeholder={item.placeholder} />
                  </Form.Item>
                ))}
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default Ntlm;
