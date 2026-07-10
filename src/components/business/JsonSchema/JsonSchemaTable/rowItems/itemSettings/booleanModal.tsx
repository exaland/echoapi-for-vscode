import { useTranslation } from 'react-i18next';

import { Flex, Select, Switch } from 'antd';

const Option = Select.Option;
const BooleanModal = (props: any) => {
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
        </Flex>
        {ItemMockDom && (
          <Flex gap={20}>
            <div className="item-line">
              <div className="case-title">example</div>
              <div className="case-value">{ItemMockDom}</div>
            </div>
          </Flex>
        )}
        <div className="item-line">
          <div className="case-title">{t('common.schema.advanced_settings.default_values')}</div>
          <div className="case-value">
            <Select
              value={value?.default}
              style={{ width: '100%' }}
              onChange={onChange.bind(null, 'default')}
            >
              <Option value>true</Option>
              <Option value={false}>false</Option>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default BooleanModal;
