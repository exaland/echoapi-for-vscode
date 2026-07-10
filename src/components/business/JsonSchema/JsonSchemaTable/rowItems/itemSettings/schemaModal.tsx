import { useTranslation } from 'react-i18next';

import { Flex, Switch } from 'antd';

const StringModal = (props: any) => {
  const { t } = useTranslation();
  const {
    isRequired,
    handleUpdateRequired,
    handleChangeAllowNull,
    empty,
    SelectTypeDom,
    ItemMockDom,
  } = props;

  return (
    <>
      <div className="schema-setting">
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
      </div>
    </>
  );
};

export default StringModal;
