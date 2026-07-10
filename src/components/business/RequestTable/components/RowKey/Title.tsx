import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, CheckboxProps, Flex } from 'antd';

import cn from 'classnames';
import { isEqual, isNumber } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';

import { RequestTableProps } from '../../types';

type Props = Pick<RequestTableProps, 'tabType' | 'queryAddEqual' | 'onChangeQueryAddEqual'> & {
  allCheckboxStatus: {
    checked: boolean;
    indeterminate: boolean;
  };
  handleCheckAll: CheckboxProps['onChange'];
};

const RowKeyTitle: FC<Props> = memo(
  ({ queryAddEqual, tabType, allCheckboxStatus, handleCheckAll, onChangeQueryAddEqual }) => {
    const { t } = useTranslation();
    return (
      <Flex justify="space-between" align="center" style={{ marginLeft: '-8px' }}>
        <div style={{ marginLeft: '0' }}>
          {!isEqual(tabType, 'socketio') && (
            <Checkbox
              {...allCheckboxStatus}
              onChange={handleCheckAll}
              style={{ paddingInlineEnd: 19 }}
            />
          )}
          <span className="txt-title">{t('common.request_table.param_name')}</span>
        </div>
        {isEqual(tabType, 'query') && isNumber(queryAddEqual) && (
          <span className="sameIcon">
            <Tooltip
              title={
                <div>
                  {isEqual(queryAddEqual, -1)
                    ? t('common.request_table.dont_add_euqal')
                    : t('common.request_table.add_euqal')}
                </div>
              }
            >
              <span className={cn('query-eq-icon-wrap', isEqual(queryAddEqual, 1) ? 'active' : '')}>
                <IconFont
                  type="icon-equal"
                  onClick={() => {
                    onChangeQueryAddEqual?.(isEqual(queryAddEqual, -1) ? 1 : -1);
                  }}
                />
              </span>
            </Tooltip>
          </span>
        )}
      </Flex>
    );
  }
);

export default RowKeyTitle;
