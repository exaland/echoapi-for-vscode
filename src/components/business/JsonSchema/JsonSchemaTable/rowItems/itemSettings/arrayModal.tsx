import { useTranslation } from 'react-i18next';

import { Flex, InputNumber, Switch } from 'antd';

import { isNumber } from 'lodash';

const ArrayModal = (props: any) => {
  const {
    value,
    onChange,
    handleUpdateRequired,
    isRequired,
    empty,
    handleChangeAllowNull,
    SelectTypeDom,
    ItemMockDom,
  } = props;
  const { t } = useTranslation();
  return (
    <>
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
          <Flex align="center" gap={8}>
            {t('common.schema.advanced_settings.unique_item')}
            <Switch
              size="small"
              checked={value?.uniqueItems}
              onChange={onChange.bind(null, 'uniqueItems')}
            />
          </Flex>
        </Flex>
        {ItemMockDom && (
          <Flex gap={20}>
            <div className="item-line">
              <div className="case-title">Example</div>
              <div className="case-value">{ItemMockDom}</div>
            </div>
          </Flex>
        )}
        <Flex gap={20}>
          <div className="item-line">
            <div className="case-title">{t('common.schema.advanced_settings.min_item')}</div>
            <div className="case-value">
              <InputNumber
                size="small"
                min={0}
                value={isNumber(value?.minItems) ? value?.minItems : 0}
                onChange={onChange.bind(null, 'minItems')}
              />
            </div>
          </div>
        </Flex>
        <Flex gap={20}>
          <div className="item-line">
            <div className="case-title">{t('common.schema.advanced_settings.max_item')}</div>
            <div className="case-value">
              <InputNumber
                min={0}
                size="small"
                value={isNumber(value?.maxItems) ? value?.maxItems : 0}
                onChange={onChange.bind(null, 'maxItems')}
              />
            </div>
          </div>
        </Flex>
      </div>
    </>
  );
};

export default ArrayModal;
