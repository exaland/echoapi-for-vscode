import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, InputNumber, Select, Switch } from 'antd';

import { useSafeState } from 'ahooks';
import { isEmpty, isNumber, isString } from 'lodash';

const TextArea = Input.TextArea;
const Option = Select.Option;
const StringModal = (props: any) => {
  const {
    value,
    onChange,
    isRequired,
    handleUpdateRequired,
    handleChangeAllowNull,
    empty,
    SelectTypeDom,
    ItemMockDom,
  } = props;
  const { t } = useTranslation();
  const [caseValue, setCaseValue] = useSafeState([]);
  useEffect(() => {
    setCaseValue(value.enum);
  }, [value.enum]);
  return (
    <div>
      <div className="base-setting">
        <div className="item-line">{SelectTypeDom}</div>
        <Flex gap={20} className="item-all-line item-necessarily">
          <Flex align="center" gap={8}>
            {t('common.schema.advanced_settings.required')}
            <Switch
              size="small"
              onChange={() => handleUpdateRequired(isRequired)}
              value={isRequired}
            />
          </Flex>
          <Flex align="center" gap={8}>
            {t('common.schema.advanced_settings.null')}
            <Switch size="small" value={empty} onChange={handleChangeAllowNull} />
          </Flex>
        </Flex>
        {ItemMockDom && (
          <Flex gap={20}>
            <div className="item-line">
              <div className="case-title">example</div>
              <div className="case-value">{ItemMockDom}</div>
            </div>
          </Flex>
        )}
        <Flex vertical>
          <Flex gap={20} justify="space-between">
            <div className="item-line">
              <div className="case-title">
                {t('common.schema.advanced_settings.default_values')}
              </div>
              <div className="case-value">
                <Input
                  size="small"
                  value={value?.default}
                  onChange={(e) => {
                    onChange('default', e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="item-line">
              <div className="case-title">Format</div>
              <div className="case-value">
                <Select
                  value={isString(value?.format) ? value?.format : ''}
                  onChange={onChange.bind(null, 'format')}
                >
                  <Option value={undefined}>{t('common.select_tip')}</Option>
                  <Option value="date-time">date-time</Option>
                  <Option value="date">date</Option>
                  <Option value="email">email</Option>
                  <Option value="hostname">hostname</Option>
                  <Option value="ipv4">ipv4</Option>
                  <Option value="ipv6">ipv6</Option>
                  <Option value="uri">uri</Option>
                </Select>
              </div>
            </div>
          </Flex>
          <Flex gap={20} justify="space-between">
            <div className="item-line">
              <div className="case-title"> {t('common.schema.advanced_settings.min_length')}</div>
              <div className="case-value">
                <InputNumber
                  size="small"
                  min={0}
                  value={isNumber(value?.minLength) ? value?.minLength : 0}
                  onChange={onChange.bind(null, 'minLength')}
                />
              </div>
            </div>
            <div className="item-line">
              <div className="case-title"> {t('common.schema.advanced_settings.max_length')}</div>
              <div className="case-value">
                <InputNumber
                  size="small"
                  min={0}
                  value={isNumber(value?.maxLength) ? value?.maxLength : 0}
                  onChange={onChange.bind(null, 'maxLength')}
                />
              </div>
            </div>
          </Flex>
        </Flex>
        <div className="item-line">
          <div className="case-title">
            <span style={{ paddingRight: 5 }}>
              {' '}
              {t('common.schema.advanced_settings.enum_values')}
            </span>
            <Switch
              size="small"
              checked={value?.apipost_enable_enum === true ? true : false}
              onChange={onChange.bind(null, 'apipost_enable_enum', !value?.apipost_enable_enum)}
            />
          </div>
          <div className="case-value">
            <Select
              maxTagCount={3}
              style={{ width: '100%' }}
              disabled={value?.apipost_enable_enum !== true}
              mode="tags"
              value={caseValue}
              onChange={(e) => {
                setCaseValue(e);
                onChange('enum', e?.filter((item: any) => !isEmpty(item)));
              }}
              options={caseValue?.map((e) => ({ label: e, value: e }))}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">Pattern</div>
          <div className="case-value">
            <Input
              size="small"
              className="case-value"
              value={value?.pattern}
              onChange={(e) => {
                onChange('pattern', e.target.value);
              }}
            />
          </div>
        </div>

        <div className="item-line">
          <div className="case-title">{t('common.schema.advanced_settings.remarks')}</div>
          <div className="case-value">
            <TextArea
              size="small"
              autoSize={{ minRows: 3, maxRows: 3 }}
              value={value?.enumDesc}
              onChange={(e) => {
                onChange('enumDesc', e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StringModal;
