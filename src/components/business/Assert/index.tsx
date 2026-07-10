import { FC, ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, Select, SelectProps } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import produce from 'immer';
import { find, get, includes, isEqual, map } from 'lodash';

import PathPickModal from '@/components/business/PathPickModal';
import IconFont from '@/components/ui/IconFont';
import {
  BASE_COMPARE_TIMES_TYPES,
  BASE_COMPARE_TYPES,
  HIDE_TOOLS_COMPARE_TYPES,
  HIDE_VALUE_COMPARE_TYPES,
  SELECT_MODE_COMPARE_TYPES,
} from '@/constants/common';
import useTheme from '@/hooks/useTheme';
import { getCompareTypeTip } from '@/utils/common';

import VarInput from '../VarInput';
import { SOCKET_ASSERT_TYPES } from './constants';

import { AssertWrapper, DescWrapper } from './style';

type AssertValue = {
  type: string;
  expression: {
    compareType: string;
    compareValue: string | undefined;
    path: string;
  };
};

type LabelRender = SelectProps['labelRender'];

interface Props {
  value: AssertValue;
  onChange: (val: AssertValue) => void;
  rawData?: string;
}

const Assert: FC<Props> = ({ value, onChange, rawData }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const hidePathInput = useMemo(
    () => includes(['responseText', 'responseCode', 'responseTime'], value.type),
    [value.type]
  );

  const hideValueInput = useMemo(
    () => includes(HIDE_VALUE_COMPARE_TYPES, value.expression.compareType),
    [value.expression.compareType]
  );
  const collectionShow = useMemo(
    () => includes(SELECT_MODE_COMPARE_TYPES, value.expression.compareType),
    [value.expression.compareType]
  );
  const hideToolsSuffix = useMemo(
    () => includes(HIDE_TOOLS_COMPARE_TYPES, value.type),
    [value.type]
  );

  const calcTargetInfo = (type: string) => {
    const result: {
      typeSuffixIcon: ReactNode;
      valueSuffixIcon: ReactNode;
      pathPlaceholder: string;
    } = { typeSuffixIcon: null, valueSuffixIcon: null, pathPlaceholder: '' };
    const target = find(SOCKET_ASSERT_TYPES, (item) => item.value === type);

    if (target?.description) {
      result.typeSuffixIcon = (
        <>
          <span>{target?.description}</span>
          <DownOutlined />
        </>
      );
    } else {
      result.typeSuffixIcon = <DownOutlined />;
    }

    if (target?.suffixText) {
      result.valueSuffixIcon = target?.suffixText;
    }

    if (target?.placeholder) {
      result.pathPlaceholder = target?.placeholder;
    }

    return result;
  };

  const handleChange = (key: string, newVal: string) => {
    const newValue = produce(value, (draft) => {
      if (key === 'type') {
        draft.type = newVal;
      } else {
        draft.expression = {
          ...draft.expression,
          [key]: newVal,
        };
      }
    });

    onChange(newValue);
  };

  const compareOptions = useMemo(() => {
    const compareType = value.type;
    if (isEqual('responseTime', compareType)) {
      return BASE_COMPARE_TIMES_TYPES;
    }
    
    return BASE_COMPARE_TYPES;
  }, [value.type]);

  const assertTypeChange = (val: string) => {
    const newValue = produce(value, (draft) => {
      draft.type = val;
      if (isEqual('responseTime', val)) {
        const compareType = get(value, 'expression.compareType');
        if (!BASE_COMPARE_TIMES_TYPES.some((e) => e.value === compareType)) {
          draft.expression = {
            ...draft.expression,
            ['compareType']: 'eq',
          };
        }
      }
    });
    onChange(newValue);
  };

  const labelRender: LabelRender = (props) => {
    const { label, value } = props;
    const target = find(SOCKET_ASSERT_TYPES, (item) => item.value === value);
    return (
      <Flex justify="space-between" style={{ width: '100%' }}>
        <span>{label}</span>
        {target?.description && <DescWrapper>{target?.description}</DescWrapper>}
      </Flex>
    );
  };

  return (
    <AssertWrapper $token={themeToken}>
      <Flex vertical gap={themeToken.padding12}>
        <Flex gap={themeToken.padding12} align="center">
          <div className="label">{t('common.assertion.content')}</div>
          <Select
            value={value.type}
            placeholder=""
            style={{ width: '100%' }}
            labelRender={labelRender}
            onChange={assertTypeChange}
            options={map(SOCKET_ASSERT_TYPES, (item) => {
              return {
                value: item.value,
                label: item.title,
              };
            })}
          />
        </Flex>
        <Flex gap={themeToken.padding12} align="center">
          <div className="label">{t('common.assertion.expression.title')}</div>
          {!hidePathInput && (
            <Input
              placeholder={calcTargetInfo(value.type)?.pathPlaceholder}
              value={get(value, 'expression.path')}
              suffix={
                !hideToolsSuffix ? (
                  <IconFont type="icon-gongju" onClick={() => setIsOpen(true)} />
                ) : null
              }
              onChange={(event) => handleChange('path', event.target.value)}
            />
          )}
          <Select
            placeholder={t('supplement.select_if')}
            style={{ width: 240 }}
            value={get(value, 'expression.compareType')}
            onChange={(val) => handleChange('compareType', val)}
            options={map(compareOptions, (item) => {
              return {
                value: item.value,
                label: item.label,
              };
            })}
          />
          {!hideValueInput ? (
            collectionShow ? (
              <Select
                allowClear
                suffixIcon={false}
                dropdownStyle={{ display: 'none' }}
                placeholder={getCompareTypeTip(get(value, 'expression.compareType'))}
                className="collection-variable-select"
                value={
                  get(value, 'expression.compareValue')
                    ? get(value, 'expression.compareValue')?.split(',')
                    : []
                }
                mode="tags"
                tokenSeparators={[',']}
                onChange={(val) => handleChange('compareValue', val?.join(','))}
              />
            ) : (
              <VarInput
                wrapClassName="assert-input"
                hasBorder
                placeholder={getCompareTypeTip(get(value, 'expression.compareType'))}
                value={get(value, 'expression.compareValue')}
                suffix={calcTargetInfo(value.type)?.valueSuffixIcon}
                onChange={(val) => handleChange('compareValue', val)}
              />
            )
          ) : null}
        </Flex>
      </Flex>
      <PathPickModal
        defaultValue={rawData}
        type={isEqual(value.type, 'responseJson') ? 'json' : 'xml'}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
      />
    </AssertWrapper>
  );
};

export default Assert;
