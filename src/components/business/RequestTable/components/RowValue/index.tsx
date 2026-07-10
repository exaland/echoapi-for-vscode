import { memo, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UploadProps, message } from 'antd';

import { includes, isEqual } from 'lodash';
import classNames from 'classnames';
import VarInput from '@/components/business/VarInput';
import { Button, IconFont, Upload } from '@/components/ui';
import { fileTodataUrl } from '@/utils/file';

import Context from '../../context';
import { ItemProps } from '../../types';

import { RowItemWrap } from '../../style';
import VarInsertPop from '@/components/business/VarInsertPop';
import { VAR_OPTIONS_KEY } from '@/constants/variable';
import { InsertAction } from '@/types/apis/variable';

const MAX_SIZE = 5 * 1024 * 1024;

const RowValue = memo((props: ItemProps) => {
  const { rowData, rowIndex, tabType, onChange, readOnly, bodyMode, valueSuffix } = props;

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { envId } = useContext(Context);

  const handleChange = (key: string, newVal: string | number) => {
    const newRowData = {
      ...rowData,
      [key]: newVal,
    };

    onChange?.(rowIndex, newRowData);
  };

  const customRequest: UploadProps['customRequest'] = async (option: any) => {
    //If on web and file size exceeds 5M, block upload
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

  const valueChange = (str: string, operation: VAR_OPTIONS_KEY, action: InsertAction) => {
    if (action === InsertAction.insert) {
      if ([VAR_OPTIONS_KEY.desc, VAR_OPTIONS_KEY.ai_desc].includes(operation)) {
        const desc = rowData?.description || '';
        handleChange?.('description', `${desc}${str}`);
      } else {
        const value = rowData?.value || '';
        handleChange?.('value', `${value}${str}`);
      }
    } else {
      if ([VAR_OPTIONS_KEY.desc, VAR_OPTIONS_KEY.ai_desc].includes(operation)) {
        handleChange?.('description', str);
      } else {
        handleChange?.('value', str);
      }
    }
    setOpen(false);
  };

  const suffix = valueSuffix ? (
    <VarInsertPop placement="right" onChange={valueChange} setOpen={setOpen} open={open}>
      <IconFont
        className={classNames('insert-icon', { active: open })}
        type="icon-a-Dynamicvalue"
      />
    </VarInsertPop>
  ) : undefined;

  return (
    <RowItemWrap>
      {isEqual(rowData?.field_type, 'File') && isEqual(bodyMode, 'form-data') ? (
        <>
          {rowData?.file_name ? (
            <div className="file-name-wrap">
              <span className="name">{rowData?.file_name}</span>
              <IconFont type="icon-delete" onClick={handleRemoveFile} />
            </div>
          ) : (
            <Upload disabled={readOnly} customRequest={customRequest} className="upload-wrapper">
              <Button type="text">{t('common.request_table.upload')}</Button>
            </Upload>
          )}
        </>
      ) : (
        <VarInput
          suffix={suffix}
          enableNewRow
          envId={envId}
          disabledReturn={includes(['header', 'query', 'cookie'], tabType)}
          readOnly={readOnly}
          maxLength={4294967295}
          value={rowData.value || ''}
          onChange={(val) => {
            handleChange?.('value', val);
          }}
        />
      )}
    </RowItemWrap>
  );
});

export default RowValue;
