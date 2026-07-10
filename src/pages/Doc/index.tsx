import React,{useEffect} from 'react';
import { DocWrap } from './style';
import { Button, Flex, Input, message } from 'antd';
import { IconFont } from '@/components/ui';
import { MonacoEditor } from '@/components/business';
import { useSafeState } from 'ahooks';
import useShare from '@/store/useShare';
import { copyStringToClipboard, download } from '@/utils/common';
import { useTranslation } from 'react-i18next';
import { openUrl } from '@/utils/open';

const Doc = () => {
  const { t } = useTranslation();
  const docPageData = useShare(store => store.docPageData);

  useEffect(()=>{
    setValue(docPageData.openApiStr);
  },[docPageData.openApiStr]);

  const [value, setValue] = useSafeState<string>('');
  
  const exportJson = ()=>{
    download(value, docPageData.fileName, 'application/json');
    message.success('Export Success');
  };

  const duplicate = ()=>{
    copyStringToClipboard(value, () =>
      message.success(t('supplement.clipboard_success'))
    );
  };

  return (
    <DocWrap>
      <header>Doc URL</header>
      <Flex align='center' gap={8}>
        <Input
          readOnly
          value={docPageData.net_url}
          style={{flex:'1'}}
        />
        <Button type='primary' onClick={() => {
            copyStringToClipboard(docPageData.net_url, () =>
              message.success(t('supplement.clipboard_success'))
            );
          }}>{t('docs.document.copy_link')}</Button>
        <Button
          type="default"
          onClick={() => {
            openUrl(docPageData.net_url);
          }}
        >
          {t('docs.document.open_link')}
        </Button>
      </Flex>
      <Flex justify='space-between'>
      <header>OpenAPI</header>
      <Flex>
        <Button size="small" type='text' icon={<IconFont type="icon-export" />} onClick={exportJson}>Export</Button>
        <Button size="small" type='text' icon={<IconFont type="icon-copy" />} onClick={duplicate}>Copy</Button>
      </Flex>
      </Flex>
      <MonacoEditor onChange={setValue} value={value} />
    </DocWrap>
  )
}

export default Doc;