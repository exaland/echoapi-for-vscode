import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfigProvider, message } from 'antd';

import { useMemoizedFn, useSafeState, useUpdateEffect } from 'ahooks';
import cn from 'classnames';
import { ContentState, Editor, EditorProps, EditorState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { parseExp } from 'exp-mock';
import { entries, find, head, isEqual, isFunction, isNumber, isPlainObject, isString, mapKeys, merge, pick } from 'lodash';

import { VarInsertPop } from '@/components/business';
import { SYSTEM_VARS } from '@/constants/system';
import { FAKER_SPLIT_CONST, MOCK_TABS_KEY, PARSE_KEY, VAR_OPTIONS_KEY } from '@/constants/variable';
import useTheme from '@/hooks/useTheme';
import { useProjectConfig, useSystemConfig } from '@/store';
import { FuncListRenderItem, InsertAction } from '@/types/apis/variable';
import { CurlDataType } from '@/types/apis/other';
import { getGlobalFunctionMap, getGlobals } from '@/utils/send/utils';
import aTools from 'apipost-inside-tools';
import { convert, validate } from 'curl-to-postmanv2';

import EditorContext from './context';
import { compositeDecorator } from './util';

import { DraftWrap } from './style';
import { parseSafeBash } from '@/utils/curl';
import { genUrlByQuery, getParameterDataFilterContentLength } from '@/utils/apis';

type Props = {
  value: string;
  onChange?: (newVal: string) => void;
  onInput?: (text: string, charIndex: number, element: any) => void;
  pasteCurlChange?: (d: CurlDataType) => void;
  placeholder?: string;
  className?: string;
  envVars?: { [key: string]: any };
  globalVars?: { [key: string]: any };
  systemVars?: { [key: string]: string };
  enableNewRow?: boolean; // whether to allow creating a new line
  enableUpDown?: boolean; // whether to allow up/down keys
  readOnly?: boolean;
  envId: string;
  suffix?: React.ReactNode;
  stripPastedStyles?: boolean;
  maxLength?: number;
  disabledReturn?: boolean;
};
const VariableInput = (props: Props, refForward: React.Ref<any>) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const {
    value,
    onChange,
    onInput,
    placeholder,
    pasteCurlChange,
    className,
    envVars,
    globalVars,
    systemVars,
    enableNewRow = false,
    enableUpDown = true,
    readOnly,
    envId,
    suffix,
    stripPastedStyles = true,
    maxLength = 2048,
    disabledReturn = false,
  } = props;
  const language = useSystemConfig((state) => state.systemConfig.language);
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const [editorState, setEditorState] = useSafeState(EditorState.createEmpty(compositeDecorator));
  const [active, setActive] = useSafeState(false);
  const [varOpen, setVarOpen] = useSafeState(false);
  const [varConfig, setVarConfig] = useSafeState({
    position: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
    default: {
      optionKey: VAR_OPTIONS_KEY.var,
      mockTabsKey: MOCK_TABS_KEY.faker,
      value: '',
      fnList: [] as FuncListRenderItem[],
      fakerJsParamList: [],
      formatInfo: {},
    },
    start: 0,
    end: 0,
  });
  
  const refEditor = useRef<any>(null);
  const canChangeRef = useRef<boolean>(true);

  useUpdateEffect(() => {
    setActive(false);
  }, [envId]);

  useUpdateEffect(() => {
    // NOTE handlePathUpdate external url update, no need to trigger onChange event
    if (!canChangeRef.current) {
      canChangeRef.current = true;
      return;
    }

    const newValue = editorState?.getCurrentContent?.()?.getPlainText?.() || '';
    onChange?.(newValue);
  }, [editorState?.getCurrentContent?.()?.getPlainText?.()]);

  const handlePathUpdate = useMemoizedFn(() => {
    const preText = editorState.getCurrentContent().getPlainText();

    if (value === preText) {
      return;
    }

    const newContentState = ContentState.createFromText(`${value}`);
    const newState = EditorState.createWithContent(newContentState, compositeDecorator);

    canChangeRef.current = false;
    setEditorState(newState);
  });

  useEffect(handlePathUpdate, [value]);

  const handleChange: EditorProps['onChange'] = useMemoizedFn((newState) => {
    const newContentState = newState.getCurrentContent();

    canChangeRef.current = true;
    setEditorState(newState);
    const newValue = newContentState.getPlainText();

    if (isFunction(onInput)) {
      const curSelection = newState.getSelection();
      const charIndex = curSelection.getEndOffset();
      onInput(newValue, charIndex, refEditor.current?.editor);
    }
  });

  const handleReplaceText = useMemoizedFn((text, start, end) => {
    if (!isNumber(start) || !isNumber(end)) return;
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const newSelection = currentSelection.merge({
      anchorOffset: start,
      focusOffset: end,
    });
    const newContent = Modifier.replaceText(currentContent, newSelection, text);
    const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
    const lastEditorState = EditorState.moveFocusToEnd(newEditorState);

    refEditor?.current?.focus();
    canChangeRef.current = true;
    setEditorState(lastEditorState);
  });

  const handleInsertText = useMemoizedFn((text, insertIndex = 0) => {
    if (!isNumber(insertIndex)) {
      return;
    }

    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText().length;

    if (currentContentLength + text?.length > maxLength) {
      return;
    }

    const currentSelection = editorState.getSelection();
    const newSelection = currentSelection.merge({
      anchorOffset: insertIndex,
      focusOffset: insertIndex,
    });

    const newContent = Modifier.insertText(currentContent, newSelection, text);
    const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');

    refEditor?.current?.focus();
    canChangeRef.current = true;
    setEditorState(newEditorState);
  });

  useImperativeHandle(refForward, () => {
    return {
      insertText: handleInsertText,
    };
  });

  const handleKeyDown = (e: {
    keyCode: number;
    preventDefault: () => void;
    stopPropagation: () => void;
    nativeEvent: { stopImmediatePropagation: () => void };
  }) => {
    if (!enableUpDown && (e.keyCode === 38 || e.keyCode === 40)) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const handleBeforeInput: EditorProps['handleBeforeInput'] = (
    _chars,
    editorState,
    _eventTimeStamp
  ) => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText().length;
    if (currentContentLength > maxLength - 1) {
      // prevent input when current text length exceeds max length, otherwise allow input
      return 'handled';
    }
    return 'not-handled';
  };

  const handlePastedText: EditorProps['handlePastedText'] = (text, _html, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText().length;
    const limit = maxLength - currentContentLength;
    if (text?.length > limit) {
      message.destroy();
      message.info(t('supplement.overflow_str'));
      return 'handled';
    }
    const bashText = parseSafeBash(text);
    const isStartCurl = bashText?.trim()?.toLocaleLowerCase().startsWith('curl');
    let pasteHandle = false;
    if (isStartCurl) {
      const { result: isCurl = false } = validate(bashText);
      if (isCurl) {
        convert({ type: 'string', data: bashText }, (error: any, result: any) => {
          if (result?.error && !result?.result) {
            message.destroy();
            message.info(t('supplement.curl_tip'));
            return;
          }
          if (error) {
            message.destroy();
            message.info(t('supplement.curl_tip'));
            return;
          }
          const newApi = aTools.curlPostman2apipost(head<any>(result?.output)?.data);
          if (!isPlainObject(newApi)) {
            return;
          }
          newApi.request.header.parameter = getParameterDataFilterContentLength(
            newApi.request.header.parameter || []
          );
          const newUrl = genUrlByQuery(newApi?.url, newApi.request.query.parameter);
          if (isString(newUrl)) {
            newApi.url = newUrl;
          }
          if (isPlainObject(newApi)) {
            const api = {
              ...pick(newApi, ['description', 'method', 'url', 'request']),
              request: pick(newApi.request, ['header', 'query', 'body', 'auth']),
            };
            pasteCurlChange?.(api);
            pasteHandle = true;
          }
        });
      } else {
        message.destroy();
        message.info(t('supplement.curl_tip'));
      }
    }

    if (pasteHandle) {
      refEditor?.current?.blur();
      return 'handled';
    } else {
      return 'not-handled';
    }
  };

  const formatPastedText: EditorProps['formatPastedText'] = (text, html) => {
    return { text: text?.replace(/\n/g, ' '), html };
  };

  const handleReturn: EditorProps['handleReturn'] = (event) => {
    if (disabledReturn || (!enableNewRow && event.keyCode === 13)) {
      event.preventDefault();
      return 'handled';
    }
    return 'not-handled';
  };

  const valueChange = (str: string, _operation: VAR_OPTIONS_KEY, action: InsertAction) => {
    if (action === InsertAction.confirm) {
      handleReplaceText(str, varConfig.start, varConfig.end);
    }
    setVarOpen(false);
  };

  const varEle = varOpen ? (
    <VarInsertPop
      {...varConfig.default}
      placement="left"
      onChange={valueChange}
      open={varOpen}
      setOpen={setVarOpen}
    >
      <div style={{ ...varConfig.position, position: 'fixed' }}></div>
    </VarInsertPop>
  ) : (
    ''
  );

  const varClick = async (props: { start: number; end: number; decoratedText: string }, e: any) => {
    try {
      setActive(false);
      const globals = await getGlobals();
      const custom_script = await getGlobalFunctionMap();
      const currentEnv = find(envList, (item) => item.env_id === envDetailKeys);
      const environmentMap = entries(currentEnv?.env_var_list).reduce(
        (pre, [key, obj]: any) => {
          pre[key] = obj?.current_value || '';
          return pre;
        },
        {} as Record<string, any>
      );
      const systemMap = mapKeys(SYSTEM_VARS, (_value, key) => `$${key}`);
      const data = await parseExp(
        props?.decoratedText,
        merge(systemMap, globals, environmentMap),
        language,
        custom_script
      );
      
      if (data) {
        refEditor?.current?.blur();
        let value = data?.dist?.expression || '';
        let optionKey = VAR_OPTIONS_KEY.fixed;
        let mockTabsKey = MOCK_TABS_KEY.faker;
        let fakerJsParamList: any = [];
        const formatInfo: any = {};
        const fnList: FuncListRenderItem[] = data?.functions?.reduce((pre: any, item: any) => {
          if (['sha1', 'sha224', 'sha256', 'sha384', 'sha512'].includes(item.function)) {
            pre.push({
              func_name: 'sha',
              paras: {
                ['sha']: {
                  text: item.function,
                },
              },
            });
          } else if (isEqual(item.function, 'format')) {
            if (item?.paras?.format) {
              formatInfo['format'] = item?.paras?.format;
            }
            if (item?.paras?.format) {
              formatInfo['utc'] = item?.paras?.utc;
            }
          } else {
            pre.push({
              func_name: item.function,
              paras: {
                [item.function]: item.paras || {},
              },
            });
          }

          return pre;
        }, [] as FuncListRenderItem[]);
        if (data?.dist?.type === PARSE_KEY.variable) {
          optionKey = VAR_OPTIONS_KEY.var;
        }
        if ([PARSE_KEY.fakerjs, PARSE_KEY.mockjs].includes(data?.dist?.type)) {
          optionKey = VAR_OPTIONS_KEY.mock;
          if (data?.dist?.type === PARSE_KEY.fakerjs) {
            mockTabsKey = MOCK_TABS_KEY.faker;
            value = `${data?.dist?.expression?.module}${FAKER_SPLIT_CONST}${data?.dist?.expression?.function}`;
            if (isPlainObject(data?.dist?.expression?.paras)) {
              fakerJsParamList = Object.entries(data?.dist?.expression?.paras).map(
                ([key, value]) => ({
                  key,
                  value,
                })
              );
            }
          }
        }
        if (data?.dist?.type === PARSE_KEY.ai) {
          optionKey = VAR_OPTIONS_KEY.ai_value;
        }
        const position = e?.getBoundingClientRect();
        setVarConfig({
          position: {
            left: position?.x,
            top: position?.y,
            width: position?.width,
            height: position.height,
          },
          default: {
            optionKey,
            mockTabsKey,
            value,
            fnList,
            fakerJsParamList,
            formatInfo,
          },
          start: props?.start,
          end: props?.end,
        });
        setVarOpen(true);
      }
    } catch (err) {}
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tooltip: {
            colorBgSpotlight: themeToken.colorBgFolder,
            colorTextLightSolid: themeToken.fontContentColor,
          },
        },
      }}
    >
      <EditorContext.Provider
        value={{
          envVars,
          globalVars,
          systemVars,
          varClick,
        }}
      >
        <DraftWrap
          onKeyDown={handleKeyDown}
          ref={refForward}
          className={cn('mini-editor', className, {
            'editor-active': active,
            'editor-no-wrap': !enableNewRow,
          })}
        >
          <Editor
            stripPastedStyles={stripPastedStyles}
            formatPastedText={formatPastedText}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            readOnly={readOnly}
            ref={refEditor}
            placeholder={placeholder}
            editorState={editorState}
            handlePastedText={handlePastedText}
            handleBeforeInput={handleBeforeInput}
            handleReturn={handleReturn}
            onChange={handleChange}
            spellCheck={false}
          />
          {suffix}
          {varEle}
        </DraftWrap>
      </EditorContext.Provider>
    </ConfigProvider>
  );
};

const VariableInputComponent = React.forwardRef(VariableInput);
VariableInputComponent.displayName = 'VariableInput';

export default VariableInputComponent;
