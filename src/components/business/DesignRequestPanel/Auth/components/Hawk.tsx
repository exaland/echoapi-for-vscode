import { useTranslation } from 'react-i18next';

import { Checkbox, Form, Input, Select } from 'antd';

import { isEqual, map } from 'lodash';

import GhostCollapse from '@/components/ui/GhostCollapse';
import { AUTH_ENUM, HAWK_ALGOTITH_OPTIONS } from '@/constants/apis/auth';

import { MoreTipContainer } from '../style';

const options = map(HAWK_ALGOTITH_OPTIONS, (item) => ({
  label: item,
  value: item,
}));

const fieldList = [
  { label: 'Hawk Auth ID', name: 'authId', placeholder: 'Auth Id' },
  { label: 'Hawk Auth Key', name: 'authKey', placeholder: 'Auth Key' },
  { label: 'Algorithm', name: 'algorithm', placeholder: '', type: 'select', options },
];

const moreFieldList = [
  { label: 'User', name: 'user', placeholder: 'Username' },
  { label: 'Nonce', name: 'nonce', placeholder: 'Nonce' },
  { label: 'ext', name: 'extraData', placeholder: 'e.g. some-app-extra-data' },
  { label: 'app', name: 'app', placeholder: 'Application ID' },
  { label: 'dlg', name: 'delegation', placeholder: 'e.g. delegated-by' },
  { label: 'Timestamp', name: 'timestamp', placeholder: 'TimeStamp' },
];

const Hawk = () => {
  const { t } = useTranslation();
  return (
    <>
      {map(fieldList, (item) => (
        <Form.Item label={item.label} name={[AUTH_ENUM.HAWK, item.name]}>
          {isEqual(item.type, 'select') ? (
            <Select placeholder={item.placeholder} options={item?.options || []} />
          ) : (
            <Input.TextArea autoSize placeholder={item.placeholder} />
          )}
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
                  <Form.Item label={item.label} name={[AUTH_ENUM.HAWK, item.name]}>
                    <Input.TextArea autoSize placeholder={item.placeholder} />
                  </Form.Item>
                ))}
                <Form.Item
                  valuePropName="checked"
                  noStyle
                  name={[AUTH_ENUM.HAWK, 'includePayloadHash']}
                >
                  <Checkbox className="auth-checked">include payload hash</Checkbox>
                </Form.Item>
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default Hawk;
