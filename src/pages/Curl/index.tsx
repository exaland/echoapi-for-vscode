import { CurlWrap } from './style';
import MonacoEditor from '@/components/business/MonacoEditor';
import { useSafeState } from 'ahooks';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { parseSafeBash } from '@/utils/curl';

const Curl = () => {
  const { t } = useTranslation();
  const [value, setValue] = useSafeState<string>('');

  const handleImportCurl = async () => {
    try {
      const parsedValue = parseSafeBash(value);
      
      window?.vscode.postMessage({
        action: 'curlImport',
        data: parsedValue
      });
    } catch (error) {
    }
  };

  return (
    <CurlWrap vertical>
      <MonacoEditor className='curl-monaco-editor' onChange={setValue} value={value} />
      <Button type="primary" onClick={handleImportCurl}>
        {t('supplement.import')}
      </Button>
    </CurlWrap>
  );
};
export default Curl;