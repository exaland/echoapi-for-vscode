import { memo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UploadProps, message } from 'antd';

import { includes, isEqual } from 'lodash';

import VarInput from '@/components/business/VarInput';
import { Button, IconFont, Upload } from '@/components/ui';
import { fileTodataUrl } from '@/utils/file';

import Context from '../../context';
import { ItemProps } from '../../types';

import { RowItemWrap } from '../../style';

const MAX_SIZE = 5 * 1024 * 1024;

const RowValue = memo((props: ItemProps) => {
  const { rowData, rowIndex, tabType, onChange, readOnly, bodyMode } = props;

  const { t } = useTranslation();

  const { envId } = useContext(Context);

  const handleChange = (key: string, newVal: string | number) => {
    const newRowData = {
      ...rowData,
      [key]: newVal,
    };

    onChange?.(rowIndex, newRowData);
  };

  const customRequest: UploadProps['customRequest'] = async (option: any) => {
    //If on web and file size exceeds 5MB, upload is forbidden
    if (option?.file?.size > MAX_SIZE) {
      message.error(t('supplement.upload_file_large'));
      return;
    }
    let file_base64: any = null;

    //If on web, use base64
    file_base64 = await fileTodataUrl(option?.file);

    let value = '';
    value = option?.file?.name;
    const newRowData = {
      ...rowData,
      value,
      file_name: option?.file?.name,
      file_base64,
    };

    onChange?.(rowIndex, newRowData);
    option.onSuccess(null);
  };

  const handleRemoveFile = () => {
    const newRowData = {
      ...rowData,
      value: '',
      file_name: '',
      file_base64: '',
    };

    onChange?.(rowIndex, newRowData);
    return true;
  };

  return (
    <RowItemWrap>
      {isEqual(rowData?.schema?.type, 'File') && isEqual(bodyMode, 'form-data') ? (
        <></>
      ) : (
        <VarInput
          enableNewRow
          envId={envId}
          disabledReturn={includes(['header', 'query', 'cookie'], tabType)}
          readOnly={readOnly}
          maxLength={4294967295}
          value={rowData.example || ''}
          onChange={(val) => {
            handleChange?.('example', val);
          }}
        />
      )}
    </RowItemWrap>
  );
});

export default RowValue;
