import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, UploadProps, message } from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';

import { UploadOutlined } from '@ant-design/icons';
import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { isEmpty, isObject } from 'lodash';

import Upload from '@/components/ui/Upload';
import { fileTodataUrl } from '@/utils/file';

import { RequestBodyProps } from '../../types';

import { RequestBodyContentContainer } from '../../style';

const MAX_SIZE = 5 * 1024 * 1024;

const RequestBodyBinary: FC<RequestBodyProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const customRequest: UploadProps['customRequest'] = async (option: any) => {
    // If it is the web version, and the file size exceeds 5M, prohibit uploading
    if (option?.file?.size > MAX_SIZE) {
      message.error(t('supplement.upload_file_large'));
      return;
    }

    let data_url: string = '';

      // If it is the web version, use base64
      data_url = await fileTodataUrl(option?.file);

    const file_path: any = null;
    const newResult = produce(value, (draft) => {
      draft!.binary = {
        file_name: option.file?.name,
        data_url,
        file_path,
      };
    });

    onChange?.('body', newResult);
    option.onSuccess(null);
  };

  const handleRemoveFile = () => {
    const newResult = produce(value, (draft) => {
      draft!.binary = null;
    });

    onChange?.('body', newResult);
    return true;
  };

  const computedFileList = useMemo(() => {
    if (!isObject(value?.binary) || isEmpty(value?.binary?.file_name)) {
      return [];
    }
    return [
      {
        uid: snowflakeId(),
        name: value?.binary?.file_name || '',
        status: 'done' as UploadFileStatus,
      },
    ];
  }, [value?.binary]);

  return (
    <RequestBodyContentContainer>
      <Upload
        fileList={computedFileList}
        onRemove={handleRemoveFile}
        customRequest={customRequest}
        className="upload-wrapper"
      >
        <Flex vertical align="center" gap={12}>
          <Button icon={<UploadOutlined />}>{t('supplement.upload_file')}</Button>
        </Flex>
      </Upload>
    </RequestBodyContentContainer>
  );
};

export default RequestBodyBinary;
