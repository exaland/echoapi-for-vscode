import { FC, memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AutoComplete, Flex, Form, FormProps, Input, Popconfirm, Select, Space, Typography } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import produce from 'immer';
import { head, map, size, toUpper } from 'lodash';

import LineTabs from '@/components/business/LineTabs';
import OpenApiRawEditor from '@/components/business/OpenApiRawEditor';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import { OPENAPI_EXPECT_CONTENT_TYPE, OPENAPI_REQUEST_BODY_MODE_ENUM } from '@/constants/apis';
import { HTTP_RESPONSE_CODE_LIST } from '@/constants/common';

import {
  ExampleFormWrap,
  ExampleNameContainer,
  PopoverContainer,
  PredefinedResponseContainer,
} from './style';

interface Props {
  defaultActiveKey?: string;
  value: any;
  onChange: (value: any) => void;
}

const PredefinedResponse: FC<Props> = memo(({ defaultActiveKey, value, onChange }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [popoverOpen, setPopoverOpen] = useSafeState(false);
  const [activeKey, setActiveKey] = useSafeState('200');

  useEffect(() => {
    setActiveKey(head(Object.keys(value)) || '200');
  }, [head(Object.keys(value))]);

  useEffect(() => {
    defaultActiveKey && setActiveKey(defaultActiveKey);
  }, [defaultActiveKey, setActiveKey]);

  const handleOnChange = useMemoizedFn((key: string, newValue: any) => {
    const newData = produce(value, (draft: any) => {
      if (key === 'content_type') {
        let infoObj;
        for (const type in draft[activeKey].content) {
          infoObj = draft[activeKey].content[type]
          break;
        }
        draft[activeKey].content = {
          [newValue]: infoObj || {
            "schema": {
              "type": "object",
              "properties": {}
            },
            "example": ""
          }
        }
        return;
      }
      if (["schema", 'example'].includes(key)) {
        let infoObj;
        for (const type in draft[activeKey].content) {
          infoObj = draft[activeKey].content[type]
          break;
        }
        if (infoObj) {
          infoObj[key] = newValue;
        }
        return;
      }
      draft[activeKey][key] = newValue;
    });

    onChange(newData);
  });

  const items = useMemo(() => {
    let result: any = [];
    Object.keys(value).forEach(code => {
      const responseData = value[code];
      result.push({
        label: (
          <>
            <Typography.Text ellipsis style={{ maxWidth: '200px',color:'inherit' }}>
              {responseData?.description || ''}
            </Typography.Text>
            {code && `（${code}）`}
          </>
        ),
        key: code,
      });
    });
    return result;
  }, [value]);

  const currentInfo = useMemo(() => {
    const currentCode = value[activeKey];

    return currentCode;
  }, [value, activeKey]);

  const rowOptions = useMemo(
    () => map(OPENAPI_EXPECT_CONTENT_TYPE, (item) => ({ label: toUpper(item.key), value: item.value })),
    [OPENAPI_EXPECT_CONTENT_TYPE]
  );

  const codeOptions = useMemo(
    () => map(HTTP_RESPONSE_CODE_LIST, (item) => ({ label: item, value: `${item}`, disabled: Object.keys(value).includes(`${item}`) })),
    [HTTP_RESPONSE_CODE_LIST, value]
  );

  const rawEditorValue = useMemo(
    () => {
      let info;
      for (const key in currentInfo?.content) {
        info = currentInfo.content[key]
        break;
      }
      return info || {};
    },
    [currentInfo]
  );
  const onFinish: FormProps['onFinish'] = (values) => {

    const newData = produce(value, (draft: any) => {
      let type = OPENAPI_EXPECT_CONTENT_TYPE.find(i => i.value === values.content_type)?.value || 'application/json';
      draft[values.code] = {
        description: values.name,
        content: {
          [type]: {
            schema: {
              "type": "object",
              "properties": {}
            },
            example: ""
          }
        }
      }
    });

    onChange(newData);
    setPopoverOpen(false);
    form.resetFields();
  };

  const popoverContent = (
    <ExampleFormWrap>
      <Flex vertical>
        <Form
          labelAlign="left"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            colon={false}
            style={{ marginBottom: 8 }}
            label={
              <ExampleNameContainer>{t('api.design.new_modal.response_name')}</ExampleNameContainer>
            }
            rules={[
              {
                required: true,
                message: t('api.design.new_modal.name_error_tip'),
              },
            ]}
            name="name"
          >
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item
            colon={false}
            style={{ marginBottom: 8 }}
            rules={[
              {
                required: true,
                message: t('api.design.new_modal.code_tip'),
              },
            ]}
            label={<ExampleNameContainer>{t('api.design.new_modal.code')}</ExampleNameContainer>}
            name="code"
          >
            <Select options={codeOptions} />
          </Form.Item>
          <Form.Item
            colon={false}
            style={{ marginBottom: 8 }}
            rules={[
              {
                required: true,
                message: t('api.design.new_modal.content_type_tip'),
              },
            ]}
            label={
              <ExampleNameContainer>{t('api.design.new_modal.content_type')}</ExampleNameContainer>
            }
            name="content_type"
          >
            <Select options={rowOptions} />
          </Form.Item>
          <Flex justify="flex-end">
            <Button size="small" type="primary" onClick={() => form.submit()}>
              {t('api.design.new_modal.confirm')}
            </Button>
          </Flex>
        </Form>
      </Flex>
    </ExampleFormWrap>
  );

  const exampleDel = useMemoizedFn(() => {
    const newData = produce(value, (draft: any) => {
      delete draft[activeKey];
      // draft.example = filter(draft.example, ({ example_id }) => example_id !== activeKey);
    });
    onChange(newData);
    setActiveKey(head(Object.keys(value)) || '200');
  });

  const tabBarExtraContent = (
    <Flex>
      {size(Object.keys(value)) > 1 && (
        <Popconfirm onConfirm={exampleDel} title={t('common.tips')}>
          <Button style={{ padding: 0 }} type="text">
            <IconFont type="icon-trash" />
          </Button>
        </Popconfirm>
      )}
      <PopoverContainer
        placement="topLeft"
        trigger="click"
        overlayStyle={{ minWidth: 320 }}
        content={popoverContent}
        open={popoverOpen}
        onOpenChange={(open) => {
          setPopoverOpen(open);
          if (!open) {
            form.resetFields();
          }
        }}
      >
        <Button type="text" icon={<IconFont type="icon-circle-add" className="add-icon" />}>
          {t('api.design.new_modal.new_response')}
        </Button>
      </PopoverContainer>
    </Flex>
  );

  return (
    <PredefinedResponseContainer>
      <LineTabs
        items={items}
        activeKey={activeKey}
        onChange={setActiveKey}
        tabBarExtraContent={tabBarExtraContent}
        wrapStyle={{height: "auto"}}
      />
      <Flex align="center" justify="space-between">
        <Space align="center" className="info-wrap">
          <Input
            width={110}
            value={currentInfo?.description}
            onChange={(event) => handleOnChange('description', event.target.value)}
            style={{background:'var(--vscode-sideBar-background, #262626)'}}
          />
          <AutoComplete
            options={map(HTTP_RESPONSE_CODE_LIST, (item) => ({ value: `${item}` }))}
            style={{ width: 60 }}
            value={activeKey}
            onChange={(value) => null}
            disabled
          />
          <Select
            popupMatchSelectWidth={false}
            // style={{ width: 110 }}
            options={rowOptions}
            value={head(Object.keys(currentInfo?.content || {}))}
            onChange={(value) => handleOnChange('content_type', value)}
          />
        </Space>
      </Flex>
      <div className="response-content-wrap raw-editor-wrap">
        <OpenApiRawEditor
          responseParameterTitle={t('common.raw_input.body_value')}
          mode={head(Object.keys(currentInfo?.content || {}))}
          isParameter={[OPENAPI_REQUEST_BODY_MODE_ENUM.BINARY, OPENAPI_REQUEST_BODY_MODE_ENUM.HTML].includes(
            head(Object.keys(currentInfo?.content || {})) as OPENAPI_REQUEST_BODY_MODE_ENUM
          )}
          value={rawEditorValue}
          onChange={(key, value) => handleOnChange(key, value)}
        />
      </div>
    </PredefinedResponseContainer>
  );
});

export default PredefinedResponse;
