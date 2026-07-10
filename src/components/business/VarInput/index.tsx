import React, { KeyboardEvent, useMemo } from 'react';

import { useMemoizedFn, useSafeState } from 'ahooks';
import cn from 'classnames';
import { find, isFunction } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import DraftEdit from '@/components/business/DraftEdit';
import VarMentions from '@/components/business/VarMentions';
import { SYSTEM_VARS } from '@/constants/system';
import { useProjectConfig } from '@/store';

import { getElementTextOffset } from './util';

import { VarInputContainer } from './style';
import { CurlDataType } from '@/types/apis/other';

interface VarInputProps {
  envId?: string;
  value: string;
  readOnly: boolean;
  enableNewRow: boolean;
  placeholder: string;
  hasBorder: boolean;
  suffix: React.ReactNode;
  maxLength?: number;
  onChange: (val: string) => void;
  onBlur?: (val: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>, isEnvOpen?: boolean) => void;
  pasteCurlChange?: (d: CurlDataType) => void;
  wrapClassName?: string;
  disabledReturn?: boolean;
}

type EnvOptions = {
  offset?: Partial<React.CSSProperties>;
  secondLastChar?: number;
  text?: string;
};
export default function VarInput(props: Partial<VarInputProps>) {
  const {
    envId = '',
    value,
    enableNewRow = false,
    hasBorder = false,
    readOnly,
    placeholder /*, envVars, globalVars*/,
    suffix,
    maxLength,
    onChange,
    onBlur,
    onKeyDown,
    pasteCurlChange,
    wrapClassName,
    disabledReturn,
  } = props;

  const { envList, envDetailKeys, globalVars } = useProjectConfig(
    useShallow(({ envList, envDetailKeys, globalVars }) => ({
      envList,
      envDetailKeys,
      globalVars,
    }))
  );

  const [envVisible, setEnvVisible] = useSafeState(false);
  const [envObj, setEnvObj] = useSafeState<EnvOptions | null>(null);

  const refEditor = React.useRef<any>(null);

  const currentEnvId = envId || envDetailKeys;
  const envVars = useMemo(() => {
    return find(envList, (item) => currentEnvId === item?.env_id)?.env_var_list || {};
  }, [envList, currentEnvId]);
  const global_vars = useMemo(() => {
    const glb: { [k: string]: string } = {};
    for (const key in globalVars || {}) {
      if (Object.prototype.hasOwnProperty.call(globalVars, key)) {
        const element = globalVars[key];
        glb[key] = element?.current_value || element?.value;
      }
    }
    return glb;
  }, [globalVars]);
  const handleInput = useMemoizedFn((str: string, selectionPosition: number, element) => {
    const lastText = str.substring(selectionPosition - 2, selectionPosition);

    if (envVisible || lastText !== '{{') {
      setEnvVisible(false);
      return;
    }

    const position = getElementTextOffset(element, selectionPosition);

    setEnvObj({
      offset: {
        // inputIndex: 1,
        left: position.left || 0,
        top: position.top || 0,
      },
      secondLastChar: selectionPosition - 2,
      text: str,
    });
    setEnvVisible(true);
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isFunction(onKeyDown)) {
      onKeyDown(event, envVisible);
    }
  };

  const handleBlur = () => {
    onBlur?.(value || '');
  };

  return (
    <VarInputContainer
      className={cn({ 'has-border': hasBorder }, wrapClassName)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <DraftEdit
        ref={refEditor}
        placeholder={placeholder || ''}
        readOnly={readOnly}
        maxLength={maxLength}
        envId={currentEnvId}
        suffix={suffix}
        enableNewRow={enableNewRow}
        enableUpDown={envVisible === false}
        disabledReturn={disabledReturn}
        envVars={envVars}
        globalVars={global_vars}
        systemVars={SYSTEM_VARS}
        value={value || ''}
        onChange={(val) => onChange?.(val || '')}
        onInput={handleInput}
        pasteCurlChange={pasteCurlChange}
      />
      {envVisible && (
        <VarMentions
          onSelect={(val: string) => {
            refEditor &&
              refEditor.current &&
              refEditor.current.insertText(`${val}}}`, (envObj?.secondLastChar || 0) + 2);
          }}
          onCancel={() => {
            setTimeout(() => {
              setEnvVisible(false);
            }, 100);
          }}
          envVisible={envVisible}
          offset={envObj?.offset}
          env_id={currentEnvId}
        />
      )}
    </VarInputContainer>
  );
}
