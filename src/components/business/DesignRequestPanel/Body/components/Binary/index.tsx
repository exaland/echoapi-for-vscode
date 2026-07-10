import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, UploadProps, message } from 'antd';
import { UploadFileStatus } from 'antd/es/upload/interface';

import { UploadOutlined } from '@ant-design/icons';
import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { isEmpty, isPlainObject } from 'lodash';

import Upload from '@/components/ui/Upload';
import { fileTodataUrl } from '@/utils/file';

import { RequestBodyProps } from '../../types';

import { RequestBodyContentContainer } from '../../style';

const MAX_SIZE = 5 * 1024 * 1024;

const RequestBodyBinary: FC<RequestBodyProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const customRequest: UploadProps['customRequest'] = async (option: any) => {
    //If on web and file size exceeds 5MB, upload is forbidden
    if (option?.file?.size > MAX_SIZE) {
      message.error(t('supplement.upload_file_large'));
      return;
    }

    let data_url: string = '';

      //If on web, use base64
      data_url = await fileTodataUrl(option?.file);

    const file_path: any = null;
    const newResult = produce(value, (draft) => {
      draft!.type = 'string';
      draft!.format = 'binary';
      draft!.example = {
        fileName:option.file?.name,
        file:data_url
      }
    });

    onChange?.(newResult);
    option.onSuccess(null);
  };

  const handleRemoveFile = () => {
    const newResult = produce(value, (draft) => {
      draft!.example = '';
    });

    onChange?.(newResult);
    return true;
  };

  const computedFileList = useMemo(() => {
    if (!isPlainObject(value?.example) || isEmpty(value?.example?.fileName)) {
      return [];
    }
    return [
      {
        uid: snowflakeId(),
        name: value?.example?.fileName || '',
        status: 'done' as UploadFileStatus,
      },
    ];
  }, [value?.example]);

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
