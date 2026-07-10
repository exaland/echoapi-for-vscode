import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { has, isUndefined } from 'lodash';

import { Button, Tooltip } from '@/components/ui';
import IconFont from '@/components/ui/IconFont';
import CustomPopover from '@/components/ui/Popover';
import { MOCK_LANGUAGE_MAP } from '@/constants/settings';
import { FAKERJS_VAR_LIST } from '@/constants/variable';
import useTheme from '@/hooks/useTheme';
import { useSystemConfig } from '@/store';

import context from './context';
import ErrorTag from './errorTag';

import { ContainerWrap } from './style';

const EnvTag = (props: { decoratedText: string; children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const targetRef = useRef(null);
  const { decoratedText } = props;
  const language = useSystemConfig((state) => state.systemConfig.language);

  const varName = `${decoratedText}`.replace(/^\{\{\$|\}\}$/g, '')?.split('|')?.[0];
  const { systemVars, varClick } = React.useContext(context);

  const systemValue: string | undefined = systemVars?.[varName];

  const desc = useMemo(() => {
    let description = '';
    if (varName?.startsWith('fakerjs.')) {
      const end = varName.indexOf('(') === -1 ? varName.length : varName.indexOf('(');
      const key = varName.substring(8, end);
      const fakerDescription =
        FAKERJS_VAR_LIST.find((item) => `${item.module}.${item.function}` === `${key}`)
          ?.description || '';
      if (has(fakerDescription, MOCK_LANGUAGE_MAP[language])) {
        description = fakerDescription[MOCK_LANGUAGE_MAP[language]] as unknown as string;
      }
    }
    return description;
  }, [varName, language]);

  if (isUndefined(systemValue) && !varName?.startsWith('fakerjs.')) {
    return <ErrorTag>{props.children}</ErrorTag>;
  }

  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      <div className="item-title">
        <div className="pop-var-icon">
          <IconFont type="icon-label-gloabl" />
        </div>
        <div className="pop-var-title blue">
          <Tooltip title={varName}>{varName}</Tooltip>
        </div>
      </div>
      <div className="item-var">
        <div className="var-name">{t('supplement.var_desc')}</div>
        <div className="var-value">{systemValue || desc || ''}</div>
      </div>
      <div className="item-var">{t('supplement.scope')}</div>
      <div className="item-desc">{t('supplement.inner_var')}</div>
      <div className="item-edit">
        <Button size="small" type="primary" onClick={() => varClick(props, targetRef.current)}>
          {t('supplement.edit')}
        </Button>
      </div>
    </ContainerWrap>
  );
  return (
    <CustomPopover placement="bottomLeft" content={tipsElement}>
      <span ref={targetRef} className="tag-global">
        {props.children}
      </span>
    </CustomPopover>
  );
};

export default EnvTag;
