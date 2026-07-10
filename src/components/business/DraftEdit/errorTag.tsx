import { useTranslation } from 'react-i18next';

import { Tooltip } from '@/components/ui';
import IconFont from '@/components/ui/IconFont';
import CustomPopover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';

import { ContainerWrap } from './style';

const EnvTag = (props: { decoratedText?: string; children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      <div className="item-title">
        <div className="pop-var-icon error ">
          <IconFont type="icon-warn" style={{ color: 'red' }} />
        </div>
        <div className="pop-var-title red">
          <Tooltip title={t('supplement.un_var')}>{t('supplement.un_var')}</Tooltip>
        </div>
      </div>
      <div className="item-desc">{t('supplement.aha_var')}</div>
    </ContainerWrap>
  );
  return (
    <CustomPopover placement="bottomLeft" className="tag-error-tooltip" content={tipsElement}>
      <span className="tag-error">{props.children}</span>
    </CustomPopover>
  );
};

export default EnvTag;
