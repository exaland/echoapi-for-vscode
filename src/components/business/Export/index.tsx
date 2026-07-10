import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { EXPORT_TYPE_ENUM } from '@/constants/settings';
import ExportComponent from './ExportComponent';
import { ExportWrap } from './style';

const { Title } = Typography;

const Export = () => {
  const { t } = useTranslation();
  const onClick = async ({ exportType, version }: { [key: string]: string }) => {
    if (exportType === EXPORT_TYPE_ENUM.echoapi) {
    }
    window?.vscode.postMessage({
      action: 'exportProjectData',
      data:{
        type:exportType,
        version
      }
    });
  };
  return (
    <ExportWrap>
      <Title style={{fontSize:16}} level={3}>{t('settings.export_project.title')}</Title>
      <ExportComponent onClick={onClick} />
    </ExportWrap>
  );
};

export default Export;
