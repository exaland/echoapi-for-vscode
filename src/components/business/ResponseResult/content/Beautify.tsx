import MonacoEditor from '@/components/business/MonacoEditor';
import { EditFormat, isJSONString } from '@/utils/common';
import { isString } from 'lodash';
import { Empty } from '@/components/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  rawHtml?: string;
  mode?: string;
  isSSE?: boolean;
  data?: any;
}

const Beautify = (props: Props) => {
  const { t } = useTranslation();

  const { mode, rawHtml, isSSE=false, data } = props || {};
  const { mode: language, value: editValue } = useMemo(() => {
    let originData = rawHtml || '';
    if (isSSE) {
      try {
        if (isString(originData)) {
          originData = JSON.parse(originData);
        }
      } catch (err) {}
      if (isJSONString(originData)) {
        originData = JSON.parse(originData);
      } else {
        originData = rawHtml || '';
      }
    }
    return EditFormat(originData || '');
  }, [rawHtml, isSSE]);

  if (data?.response_size && data?.response_size / 1024 / 1024 > 10) {
    return <Empty description={t('supplement.file_big')} />;
  }

  return <MonacoEditor readOnly language={mode || language} value={editValue} />;
};

export default Beautify;
