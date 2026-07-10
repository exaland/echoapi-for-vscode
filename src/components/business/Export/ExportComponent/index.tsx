import { useTranslation } from 'react-i18next';

import { Flex, message } from 'antd';

import { useSafeState } from 'ahooks';
import classnames from 'classnames';

import AlertText from '@/components/ui/AlertText';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import Radio from '@/components/ui/Radio';
import Tooltip from '@/components/ui/Tooltip';
import { EXPORT_TYPE_LIST } from '@/constants/settings';
import useTheme from '@/hooks/useTheme';

import { ImportExportWrap } from './style';

interface Props {
  onClick?: ({ exportType, version }: { [k: string]: string }) => Promise<void>;
}
const Export = (props: Props) => {
  const { onClick } = props || {};
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const [loading, setLoading] = useSafeState<boolean>(false);
  const [exportType, setExportType] = useSafeState<string>('echoapi');
  const [version, setVersion] = useSafeState<string>('3.0');

  const exportHandle = async () => {
    try {
      setLoading(true);
      await onClick?.({ exportType, version });
    } catch (err: any) {
      message.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImportExportWrap $token={themeToken}>
      <div className="import-project-item">
        <div className="import-project-item-title">{t('settings.export_project.data_format')}</div>
        <div className="import-project-item-content">
          <Radio.Group value={exportType}>
            {EXPORT_TYPE_LIST.map((item) => (
              <Tooltip title={item?.disabled ? t('supplement.will_online') : ''}>
                <div
                  key={item.key}
                  className={classnames({
                    'radio-card': true,
                    active: item.key === exportType,
                  })}
                >
                  <Radio
                    key={item.key}
                    value={item.key}
                    disabled={item?.disabled}
                    onClick={() => {
                      setExportType(item.key);
                    }}
                  >
                    <span className="radio-card-content">
                      <IconFont type={item.icon} />
                      {item.value}
                    </span>
                  </Radio>
                </div>
              </Tooltip>
            ))}
          </Radio.Group>
        </div>
      </div>
      {exportType === 'swagger' && (
        <div className="import-project-item">
          <div className="import-project-item-title">{t('settings.export_project.version')}</div>
          <div className="import-project-item-content">
            <Radio.Group
              value={version}
              onChange={(e) => setVersion(e?.target?.value)}
              className="margin-bottom-20"
            >
              <Radio value="3.0">3.0</Radio>
              <Radio value="2.0">2.0</Radio>
            </Radio.Group>
          </div>
        </div>
      )}
      <Flex justify="end">
        <Button
          loading={loading}
          // disabled
          onClick={exportHandle}
          type="primary"
          className="import-export-now"
        >
          {t('settings.export_project.export')}
        </Button>
      </Flex>
    </ImportExportWrap>
  );
};

export default Export;
