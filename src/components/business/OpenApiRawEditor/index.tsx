import { useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Segmented, SegmentedProps, Tooltip } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import MockSchema from 'apipost-mock-schema';
import Mock from 'mockjs';
import { XMLBuilder } from 'fast-xml-parser';
import i18next from 'i18next';

import { MonacoEditor } from '@/components/business';
import useSchemasHook from '@/hooks/useSchemas';
import HeaderAction from '@/components/business/JsonSchema/HeaderAction';
import { Button, IconFont } from '@/components/ui';

import VisualizationContext from './visualizationContext';

import { RawEditorContainer } from './style';
import JsonSchema from '../JsonSchema';
import { useSchemas } from '@/store';
import { parseModelToJsonSchema } from '@/utils/dataModel';
import { isArray, isEmpty, isPlainObject } from 'lodash';
import { EditFormat } from '@/utils/common';

interface Props {
  mode?: string;
  isParameter?: boolean;
  onMountAutoFormat?: boolean;
  showVisualEdit?: boolean;
  responseParameterTitle?: string;
  value: any;
  onChange: (key: string, val: any) => void;
  customAutoGeneration?: (val?: Props['value']) => void;
}

const RawEditor = ({
  mode,
  isParameter = false,
  onMountAutoFormat,
  responseParameterTitle = i18next.t('common.raw_input.body_value'),
  value,
  onChange,
  customAutoGeneration,
}: Props) => {
  const { t } = useTranslation();

  const monacoEditorRef = useRef<any>(null);

  const { isDebugArea = false } = useContext(VisualizationContext);
  const { schemasBaseData } = useSchemas((state) => state);
  const [tabsValue, setTabsValue] = useSafeState('dataStructure');
  const { getProxyMockRulesList } = useSchemasHook();
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
      if (!value?.example && !isParameter && !customAutoGeneration && !isDebugArea) {
        handleAutoGeneration(value);
      }
    }
  }, [tabsValue, isParameter, customAutoGeneration, isDebugArea]);

  const handleTabsChange: SegmentedProps['onChange'] = (value) => {
    setTabsValue(`${value}`);
  };

  const handleChange = (key: string, newValue: any) => {
    onChange(key, newValue);
  };

  const XmlParse = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });

  const parseToXml = (jsonData: any) => {
    const xmlText = XmlParse.build({
      root: jsonData,
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n${xmlText}`;
  };

  const handleAutoGeneration = useMemoizedFn(async (json: any) => {
    if (customAutoGeneration) {
      customAutoGeneration(json);
      return;
    }

    try {
      const jsonSchema = await parseModelToJsonSchema(
        value?.schema || {},
        [],
        schemasBaseData || {}
      );
      const mockRules = getProxyMockRulesList();
      //7.2.3 Default required-related bug fix
      const mockDataRequired: any = {};

      if (isPlainObject(jsonSchema)) {
        const mockSchema = new (MockSchema as any)({ app: 'echoapi' });
        await mockSchema.mock(jsonSchema, mockRules);
        const mockList = mockSchema.getMockDataList();

        if (isArray(mockList)) {
          mockList.forEach((item) => {
            if (isArray(item?.path)) {
              const descKey = item.path.filter((item: any) => !/^[0-9]$/.test(item)).join('.');
              if (!isEmpty(descKey)) {
                mockDataRequired[descKey] = item.is_required;
              }
            }
          });
        }
      }

      let jsonExample = '';
      if (json?.verify_type === 'mock') {
        try {
          jsonExample = EditFormat(json?.mock || '').value;
          jsonExample = Mock.mock(JSON.parse(jsonExample));
          jsonExample = JSON.stringify(jsonExample);
          jsonExample = EditFormat(jsonExample).value;
        } catch (error) {
          jsonExample = json?.expect?.mock || '';
        }
      } else {
        const mockSchema = new (MockSchema as any)({ app: 'echoapi' });
        jsonExample = await mockSchema.mock(jsonSchema || {}, mockRules);
        
        if (mode?.includes('xml')) {
          const xmlText = parseToXml(jsonExample);

          handleChange(
            "example",
            xmlText
          );
          return;
        }

        jsonExample = JSON.stringify(jsonExample);
      }

      const formatValue = EditFormat(jsonExample || '').value;
      const raw = !formatValue || formatValue === '{}' ? '' : formatValue;

      handleChange(
        "example",
        raw
      );
    } catch (err) {
    }
  });

  return (
    <RawEditorContainer className="raw-editor-container">
      <Flex vertical>
        <header>
          <Flex align="center" justify='space-between'>
            <Flex gap={12} align="center">
              {isDebugArea ? (
                <Tooltip title={t('common.morgan_editor.generate_tip')}>
                  <Button
                    style={{ visibility: isParameter ? 'hidden' : 'visible' }}
                    size="small"
                    onClick={() => handleAutoGeneration(value)}
                    type="primary"
                    mode="light"
                    icon={<IconFont type="icon-refresh" />}
                  >
                    {t('common.morgan_editor.generate')}
                  </Button>
                </Tooltip>
              ) : (
                <Segmented
                  value={tabsValue}
                  options={segmentedOptions}
                  onChange={handleTabsChange}
                />
              )}
            </Flex>
            {tabsValue === 'paramValue' && (
              <Flex align="center">
                <Button
                  style={{ height: '14px' }}
                  onClick={() => {
                    monacoEditorRef?.current?.formatEditor();
                  }}
                  type="text"
                  icon={<IconFont type="icon-beautify" />}
                  size="small"
                >
                  {t('common.morgan_editor.beautify')}
                </Button>
                {!isDebugArea && !isParameter && (
                  <Tooltip title={t('common.morgan_editor.generate_tip')}>
                    <Button
                      size="small"
                      onClick={() => handleAutoGeneration(value)}
                      type="primary"
                      mode="light"
                      icon={<IconFont type="icon-refresh" />}
                    >
                      {t('common.morgan_editor.generate')}
                      <IconFont type="icon-tips" style={{ marginLeft: 2 }} />
                    </Button>
                  </Tooltip>
                )}
              </Flex>
            )}
            {tabsValue === 'dataStructure' && (
              <HeaderAction
                value={value?.schema}
                onChange={(value) => handleChange('schema', value)}
                importTitle={t('common.schema.import')}
              />
            )}
          </Flex>
        </header>
        <main>
          {tabsValue === 'dataStructure' && (
            <JsonSchema
              isShowHeaderAction={false}
              value={value?.schema}
              onChange={(value) => handleChange('schema', value)}
              importTitle={t('common.schema.import')}
              models={schemasBaseData}
            />
          )}
          {tabsValue === 'paramValue' && (
            <MonacoEditor
              ref={monacoEditorRef}
              language={mode}
              height="100%"
              onMountAutoFormat={onMountAutoFormat}
              value={value?.example || ''}
              onChange={(value: string) => handleChange('example', value)}
            />
          )}
        </main>
      </Flex>
    </RawEditorContainer>
  );
};

export default RawEditor;
