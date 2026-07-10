import { useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useSafeState } from 'ahooks';
import i18next from 'i18next';

import { MonacoEditor, VarInsertPop } from '@/components/business';
import { Button, IconFont } from '@/components/ui';
import { ApisBaseRequestBody } from '@/types/apis/request';
import { ChangeFuncType } from '@/types/common';

import VisualizationContext from './visualizationContext';

import { ParamsFieldEditorContainer, RawEditorContainer } from './style';
import JsonSchema from '../JsonSchema';
import { useSchemas } from '@/store';
import { EditorProps } from '@monaco-editor/react';
import { VAR_OPTIONS_KEY } from '@/constants/variable';
import { InsertAction } from '@/types/apis/variable';

interface Props {
  mode?: string;
  isParameter?: boolean;
  onMountAutoFormat?: boolean;
  showVisualEdit?: boolean;
  responseParameterTitle?: string;
  value: Partial<ApisBaseRequestBody>;
  onChange: (val: any, key?: string) => void;
  customAutoGeneration?: (val?: Props['value']) => void;
  editorOptions?: EditorProps['options'];
  regularValueHeight?: number;
}

const RawEditor = ({
  mode,
  isParameter = false,
  onMountAutoFormat,
  responseParameterTitle = i18next.t('common.raw_input.body_value'),
  value,
  onChange,
  editorOptions = {},
  regularValueHeight,
  customAutoGeneration,
}: Props) => {
  const { t } = useTranslation();

  const monacoEditorRef = useRef<any>(null);

  const { isDebugArea = false } = useContext(VisualizationContext);
  const { schemasBaseData } = useSchemas((state) => state);
  const [tabsValue, setTabsValue] = useSafeState('paramValue');
  const [varOpen, setVarOpen] = useSafeState(false);
  const segmentedOptions = useMemo(() => {
    if (isParameter || isDebugArea) {
      setTabsValue('paramValue');
      return [{ label: responseParameterTitle, value: 'paramValue' }];
    }
    return [
      { label: t('common.raw_input.schema'), value: 'dataStructure' },
      { label: responseParameterTitle, value: 'paramValue' },
    ];
  }, [isParameter, responseParameterTitle, isDebugArea]);

  useEffect(() => {
    if (tabsValue === 'paramValue') {
      setTabsValue('paramValue');
    }
  }, [tabsValue, isParameter, customAutoGeneration]);

  const handleChange: ChangeFuncType<ApisBaseRequestBody> = (key, newValue) => {
    const result = {
      ...value,
      [key]: newValue,
    };
    onChange(result);
  };

  const valueChange = (str: string, _operation: VAR_OPTIONS_KEY, _action: InsertAction) => {
    monacoEditorRef?.current?.insertText(str);
    setVarOpen(false);
  };

  const regularStyle = regularValueHeight
  ? { height: regularValueHeight }
  : !isDebugArea
    ? { height: 380 }
    : {};
  return (
    <RawEditorContainer className="raw-editor-container">
      <Flex style={{width:'100%'}} vertical>
        <header>
          <Flex align="center" justify='space-between'>
            <Flex gap={12} align="center">
              {isDebugArea ? (
                <Flex gap={4}>
                  <VarInsertPop
                    placement="right"
                    isInsertDynamic
                    onChange={valueChange}
                    open={varOpen}
                    setOpen={setVarOpen}
                  >
                    <Button  className='beautify-text-btn-highlight' mode='light' type="text" size="small" icon={<IconFont type="icon-a-Dynamicvalue" />}>
                      {t('var_insert.dynamic_value')}
                    </Button>
                  </VarInsertPop>
                </Flex>
              ) : (
                // <Segmented
                //   value={tabsValue}
                //   options={segmentedOptions}
                //   onChange={handleTabsChange}
                // />
                <div></div>
              )}
            </Flex>

            {tabsValue === 'paramValue' && (
              <Flex align="center">
                <Button
                  style={{ height: '14px' }}
                  onClick={() => {
                    monacoEditorRef?.current?.formatEditor();
                  }}
                  mode='light'
                  type="text"
                  icon={<IconFont type="icon-beautify" />}
                  size="small"
                >
                  {t('common.morgan_editor.beautify')}
                </Button>
              </Flex>
            )}
          </Flex>
        </header>
        <main>
          {tabsValue === 'dataStructure' && (
            <JsonSchema
              isShowHeaderAction={false}
              value={value?.raw_schema}
              onChange={(value) => handleChange('raw_schema', value)}
              importTitle={t('common.schema.import')}
              models={schemasBaseData}
            />
          )}
          {tabsValue === 'paramValue' && (
          <ParamsFieldEditorContainer style={regularStyle}>
            <MonacoEditor
              ref={monacoEditorRef}
              language={mode}
              height={'100%'}
              onMountAutoFormat={onMountAutoFormat}
              value={value?.raw || ''}
              onChange={(value: string) => handleChange('raw', value)}
              options={editorOptions}
            />
          </ParamsFieldEditorContainer>
          )}
        </main>
      </Flex>
    </RawEditorContainer>
  );
};

export default RawEditor;
