import { FC } from 'react';

import { RequestBodyProps } from '../../types';
import JsonSchema from '@/components/business/JsonSchema';
import { useTranslation } from 'react-i18next';

const RequestBodyUrlencoded: FC<RequestBodyProps> = (props) => {
  const { value, onChange } = props;
  const { t } = useTranslation();
  const handleOnChange = (newValue:any) => {
    onChange(newValue);
  };

  return (
    <JsonSchema
      isShowHeaderAction={false}
      value={value}
      onChange={(value) => handleOnChange(value)}
      importTitle={t('common.schema.import')}
    />
    // <RequestTable {...otherProps} dataSource={value?.parameter || []} onChange={handleOnChange} />
  );
};

export default RequestBodyUrlencoded;
