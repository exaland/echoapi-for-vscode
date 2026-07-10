import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { IconFont, Tooltip } from '@/components/ui';
import Button from '@/components/ui/Button';
import CustomPopover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';

import context from './context';

import { ContainerWrap } from './style';

interface Props {
  text: string;
  prop: any;
  children: React.ReactNode;
}

const Index = (props: Props) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const targetRef = useRef(null);
  const { varClick } = React.useContext(context);
  const { text, prop } = props;
  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      <div className="item-title">
        <div className="pop-var-icon fixed">
          <IconFont type="icon-a-fixedvalue" />
        </div>
        <div className="pop-var-title green">
          <Tooltip title={t('var_insert.fixed_value')}>{t('var_insert.fixed_value')}</Tooltip>
        </div>
      </div>
      <div className="item-var">
        <div className="var-value">{text.substring(1, text.length - 1)}</div>
      </div>
      <div className="item-edit">
        <Button size="small" type="primary" onClick={() => varClick(prop, targetRef.current, text)}>
          {t('supplement.edit')}
        </Button>
      </div>
    </ContainerWrap>
  );

  return (
    <>
      <CustomPopover placement="bottomLeft" content={tipsElement}>
        <span ref={targetRef} className="tag-env">
          {props.children}
        </span>
      </CustomPopover>
    </>
  );
};

export default Index;
