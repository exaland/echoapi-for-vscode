/* eslint-disable quotes */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from 'antd';

import classNames from 'classnames';
import { isObject, isUndefined, omit } from 'lodash';

import { Tooltip } from '@/components/ui';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import CustomPopover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';
import { copyStringToClipboard } from '@/utils/common';

import context from './context';
import ErrorTag from './errorTag';
import FixedTag from './fixedTag';

import { ContainerWrap } from './style';

const EnvTag = (props: { decoratedText: string; children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const { decoratedText } = props;
  const targetRef = useRef(null);

  const { envVars, globalVars, varClick } = React.useContext(context);
  const varName = `${decoratedText}`.replace(/^\{\{|\}\}$/g, '')?.split('|')?.[0];

  const envInfo = envVars?.[varName];
  const globalInfo = globalVars?.[varName];

  const calcValue = (value: unknown) => {
    if (isObject(value)) {
      return JSON.stringify(value);
    }

    return `${value}`;
  };

  if (varName.startsWith("'") && varName.endsWith("'")) {
    return (
      <FixedTag prop={omit(props, 'children')} text={varName}>
        {props.children}
      </FixedTag>
    );
  }

  if (isUndefined(envInfo) && isUndefined(globalInfo)) {
    return <ErrorTag>{props.children}</ErrorTag>;
  }

  const both = !isUndefined(envInfo) && !isUndefined(globalInfo);

  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      {!isUndefined(envInfo) && (
        <>
          <div className="item-title">
            <div className="pop-var-icon">
              <IconFont type="icon-label-environment" />
            </div>
            <div className="pop-var-title green">
              <Tooltip title={varName}>{varName}</Tooltip>
            </div>
          </div>
          <div className="item-var">{t('global_setting.variables_table.cloud_value')}</div>
          <div className="item-content">
            <div className="var-value">{calcValue(envInfo?.value)}</div>
            <div
              className="btn-copy"
              onClick={() =>
                copyStringToClipboard(calcValue(envInfo?.value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className="item-var">{t('global_setting.variables_table.local_value')}</div>
          <div className="item-content">
            <div className="var-value">{calcValue(envInfo?.current_value)}</div>

            <div
              className="btn-copy"
              onClick={() =>
                copyStringToClipboard(calcValue(envInfo?.current_value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className="item-var">{t('supplement.scope')}</div>
          <div className="item-desc">{t('supplement.env_var')}</div>
          {!both && (
            <div className="item-edit">
              <Button
                size="small"
                type="primary"
                onClick={() => varClick(props, targetRef.current, varName)}
              >
                {t('supplement.edit')}
              </Button>
            </div>
          )}
        </>
      )}
      {!isUndefined(globalInfo) && (
        <>
          <div className={classNames('item-title', both && 'margin')}>
            <div className="pop-var-icon">
              <IconFont type="icon-label-global-var" />
            </div>
            <div className="pop-var-title global">
              <Tooltip title={varName}>{varName}</Tooltip>
            </div>
          </div>
          <div className="item-var">{t('global_setting.variables_table.cloud_value')}</div>
          <div className="item-content">
            <div className="var-value">{calcValue(globalInfo?.value)}</div>
            <div
              className="btn-copy"
              onClick={() =>
                copyStringToClipboard(calcValue(globalInfo?.value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className="item-var">{t('global_setting.variables_table.local_value')}</div>
          <div className="item-content">
            <div className="var-value">{calcValue(globalInfo?.current_value)}</div>

            <div
              className="btn-copy"
              onClick={() =>
                copyStringToClipboard(calcValue(globalInfo?.current_value) || '', () => {
                  message.success(t('supplement.copy_success'));
                })
              }
            >
              <IconFont type="icon-copy" />
            </div>
          </div>
          <div className="item-var">{t('supplement.scope')}</div>
          <div className="item-desc">{t('supplement.global')}</div>
          <div className="item-edit">
            <Button
              size="small"
              type="primary"
              onClick={() => {
                varClick(props, targetRef.current, varName);
              }}
            >
              {t('supplement.edit')}
            </Button>
          </div>
        </>
      )}
    </ContainerWrap>
  );

  return (
    <>
      <CustomPopover placement="bottomLeft" content={tipsElement}>
        <span
          ref={targetRef}
          className={classNames('tag-env', !isUndefined(globalInfo) && !both && 'global')}
        >
          {props.children}
        </span>
      </CustomPopover>
    </>
  );
};

export default EnvTag;
