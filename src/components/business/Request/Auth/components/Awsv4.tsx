import { Form, Input, Select } from 'antd';

import i18next from 'i18next';
import { isEqual, map } from 'lodash';

import GhostCollapse from '@/components/ui/GhostCollapse';
import { AUTH_AWSV4_LOCATION, AUTH_ENUM } from '@/constants/apis/auth';

import { MoreTipContainer } from '../style';

const options = map(AUTH_AWSV4_LOCATION, ({ label, value }) => ({
  label,
  value,
}));

const fieldList = [
  {
    label: i18next.t('common.auth.add_to'),
    name: 'addAuthDataToQuery',
    placeholder: i18next.t('common.select_tip'),
    type: 'select',
    options,
    initialValue: false,
  },
  { label: 'AccessKey', name: 'accessKey', placeholder: 'Access Key' },
  { label: 'SecretKey', name: 'secretKey', placeholder: 'Secret Key' },
];

const moreFieldList = [
  { label: 'AWS Region', name: 'region', placeholder: 'e.g. us-east-1' },
  { label: 'Service Name', name: 'service', placeholder: 'e.g. s3' },
  { label: 'Session Token', name: 'sessionToken', placeholder: 'Session Token' },
];

const Awsv4 = () => {
  return (
    <>
      {map(fieldList, (item) => (
        <Form.Item
          initialValue={item?.initialValue}
          label={item.label}
          name={[AUTH_ENUM.AWSV4, item.name]}
        >
          {isEqual(item.type, 'select') ? (
            <Select placeholder={item.placeholder} options={item?.options || []} />
          ) : (
            <Input.TextArea placeholder={item.placeholder} autoSize />
          )}
        </Form.Item>
      ))}
      <GhostCollapse
        items={[
          {
            key: 'awsv4-more',
            label: <MoreTipContainer>{i18next.t('common.auth.more')}</MoreTipContainer>,
            children: (
              <>
                <span className="auth-tips">{i18next.t('common.auth.more_tip')}</span>
                {map(moreFieldList, (item) => (
                  <Form.Item label={item.label} name={[AUTH_ENUM.AWSV4, item.name]}>
                    <Input.TextArea placeholder={item.placeholder} autoSize />
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

export default Awsv4;
