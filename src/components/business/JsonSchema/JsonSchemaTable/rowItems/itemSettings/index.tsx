import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Popconfirm, Segmented, Select, message } from 'antd';

import { useSafeState } from 'ahooks';
import classNames from 'classnames';
import { isNumber, isObject, isUndefined, toLower } from 'lodash';

import MonacoEditor from '@/components/business/MonacoEditor';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { copyStringToClipboard } from '@/utils/common';
import { EditFormat } from '@/utils/common';
import { openUrl } from '@/utils/open';

import { ITEM_TYPES } from '../itemKey/constant';
import ItemMock from '../itemMock';
import ArrayModal from './arrayModal';
import BooleanModal from './booleanModal';
import NumberModal from './numberModal';
import SchemaModal from './schemaModal';
import StringModal from './stringModal';

import { SchemasPopStyle, SettingContent, SettingsWrapperContainer } from './style';

const MODALPAGES: any = {
  string: StringModal,
  number: NumberModal,
  integer: NumberModal,
  boolean: BooleanModal,
  array: ArrayModal,
  oneOf: SchemaModal,
  anyOf: SchemaModal,
  allOf: SchemaModal,
  object: SchemaModal,
  schema: SchemaModal,
  null: SchemaModal,
};

const ItemSettings = (props: any, ref: any) => {
  const {
    value,
    onChange,
    modalType,
    showSettings,
    isRequired,
    handleUpdateRequired,
    empty,
    handleChangeAllowNull,
    renderChild,
    handleChangeType,
    onChangeMock,
    mockDisable,
    overrideData,
    deepIndex,
    isModelItem,
    mockValue,
  } = props;
  const { t } = useTranslation();
  const [tempValue, setTempValue] = useState(value);
  const [activeTab, setActiveTab] = useSafeState<string | number>('dataModel');

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const options = useMemo(() => {
    const opt = [
      {
        value: 'dataModel',
        label: t('common.schema.advanced_settings.set'),
      },
      {
        value: 'schema',
        label: t('common.schema.advanced_settings.edit_code'),
      },
    ];
    return opt;
  }, []);

  const handleChange = (attrName: string, newValue: any) => {
    const newVal = newValue;
    const newData = { ...tempValue };
    newData[attrName] = newVal;
    if (attrName === 'apipost_enable_enum' && newVal === false) {
      newData.apipost_enable_enum = undefined;
      newData.enum = undefined;
    }
    if (attrName === 'format' && newValue === '') {
      delete newData.format;
    }

    setTempValue(newData);
  };

  const handleChangeRaw = (val: string) => {
    let jsonData;
    try {
      jsonData = JSON.parse(val);
    } catch (ex) {}
    if (isObject(jsonData)) {
      setTempValue(jsonData);
    }
  };

  const handleSaveChanges = () => {
    if (value.type === 'integer') {
      if (tempValue?.enum?.some((d: any) => !isNumber(d))) {
        message.error(t('supplement.enum_invalid'));
        return;
      }
    }
    onChange(tempValue);
    //setModalType(null);
  };

  useImperativeHandle(ref, () => {
    return {
      handleSaveChanges,
    };
  });

  const beautifyText = useMemo(() => {
    try {
      return isObject(tempValue) ? EditFormat(JSON.stringify(tempValue))?.value : '';
    } catch (ex) {
      return JSON.stringify(tempValue);
    }
  }, [tempValue]);

  const computedActiveTab = activeTab;

  const ModalPage = MODALPAGES[modalType];

  const SelectTypeDom = (
    <Select style={{ width: '100%' }} value={value.type} size="small" onChange={handleChangeType}>
      {ITEM_TYPES.map((d: string) => (
        <Select.Option value={d} key={d}>
          <span className={classNames(d, 'item-key-types')}>{toLower(d)}</span>
        </Select.Option>
      ))}
    </Select>
  );
  const ItemMockDom = (
    <ItemMock
      disabled={mockDisable}
      deepIndex={deepIndex}
      isModelItem={isModelItem}
      overrideData={overrideData}
      value={mockValue}
      onChange={onChangeMock}
    />
  );

  if (isUndefined(ModalPage)) {
    return <></>;
  }

  return (
    <>
      <SchemasPopStyle />
      <Popconfirm
        overlayStyle={{ width: 400 }}
        placement="rightTop"
        destroyTooltipOnHide
        overlayClassName="setting-confirm-container"
        // getTooltipContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
        title={null}
        description={
          <SettingsWrapperContainer>

            <Flex style={{ minHeight: 300 }} vertical>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Segmented
                  onChange={(e: string | number) => setActiveTab(e)}
                  value={computedActiveTab}
                  options={options}
                />
              </div>

              {computedActiveTab === 'dataModel' && (
                <div style={{ width: '100%' }}>
                  <ModalPage
                    SelectTypeDom={SelectTypeDom}
                    ItemMockDom={mockDisable ? null : ItemMockDom}
                    handleUpdateRequired={handleUpdateRequired}
                    handleChangeAllowNull={handleChangeAllowNull}
                    isRequired={isRequired}
                    empty={empty}
                    value={tempValue}
                    onChange={handleChange}
                  />
                </div>
              )}
              {computedActiveTab === 'schema' && (
                <div className="source-setting">
                  <MonacoEditor
                    height={230}
                    showFullScreenBtn={false}
                    value={beautifyText}
                    onChange={(e: string) => {
                      handleChangeRaw(e);
                    }}
                  />
                </div>
              )}
            </Flex>
            <Flex className="source-help" align="center">
              <Flex
                onClick={() =>
                  openUrl('https://www.echoapi.com/wiki/docs/schema/create#advanced-field-settings')
                }
                className="source-tip"
                gap={2}
              >
                <Tooltip title={t('supplement.help')}>
                  <IconFont type="icon-tips" />
                </Tooltip>
              </Flex>
              <Button
                style={{
                  visibility: computedActiveTab === 'schema' ? 'visible' : 'hidden',
                  marginRight: 4,
                }}
                type="text"
                size="small"
                mode="background"
                onClick={() => copyStringToClipboard(beautifyText)}
              >
                {t('common.schema.advanced_settings.copy')}
              </Button>
            </Flex>
          </SettingsWrapperContainer>
        }
        onConfirm={handleSaveChanges}
        icon={null}
        okText={t('common.schema.advanced_settings.confirm')}
        cancelText={t('common.schema.advanced_settings.cancel')}
      >
        <SettingContent>{showSettings && renderChild}</SettingContent>
      </Popconfirm>
    </>
  );
};

export default React.forwardRef(ItemSettings);
