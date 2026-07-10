import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Select, SelectProps, Typography } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { find, map } from 'lodash';

import useTheme from '@/hooks/useTheme';

import VarsTable from './components/VarsTable';
import { SOCKET_PICK_VARS_TYPES } from './constants';
import { DataSource } from './types';

import { PickVarWrapper, DescWrapper } from './style';

type PickVarsValue = {
  source: string;
  variables: DataSource[];
};

type LabelRender = SelectProps['labelRender'];

interface Props {
  value: PickVarsValue;
  onChange: (val: PickVarsValue) => void;
}

const PickVars: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();

  const handleChange = (key: string, newVal: any) => {
    onChange({
      ...value,
      [key]: newVal,
    });
  };

  const calcSuffixIcon = (type: string) => {
    const target = find(SOCKET_PICK_VARS_TYPES, (item) => item.value === type);

    if (target?.description) {
      return (
        <>
          <span style={{ fontSize: 12 }}>{target?.description}</span>
          <DownOutlined />
        </>
      );
    }
    return <DownOutlined />;
  };

  const labelRender: LabelRender = (props) => {
    const { label, value } = props;
    const target = find(SOCKET_PICK_VARS_TYPES, (item) => item.value === value);
    return (
      <Flex justify="space-between" style={{ width: '100%' }}>
        <span>{label}</span>
        {target?.description && <DescWrapper>{target?.description}</DescWrapper>}
      </Flex>
    );
  };

  return (
    <PickVarWrapper $token={themeToken}>
      <Flex vertical gap={themeToken.padding12}>
        <Flex gap={themeToken.padding12} align="center">
          <div className="label">{t('common.set_variables.resource')}</div>
          <Select
            placeholder=""
            style={{ width: '100%' }}
            value={value.source}
            labelRender={labelRender}
            onChange={(val) => handleChange('source', val)}
            options={map(SOCKET_PICK_VARS_TYPES, (item) => {
              return {
                value: item.value,
                label: item.title,
              };
            })}
          />
        </Flex>
        <Flex vertical gap={themeToken.padding12}>
          <Typography.Text>{t('common.set_variables.default_title')}</Typography.Text>
          <VarsTable
            source={value.source}
            data={value.variables}
            onChange={(val) => handleChange('variables', val)}
          />
        </Flex>
      </Flex>
    </PickVarWrapper>
  );
};

export default PickVars;
