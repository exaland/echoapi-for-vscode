import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import classNames from 'classnames';
import { concat, entries, filter, find, isString, map, size } from 'lodash';

import { Empty, Tooltip } from '@/components/ui';
import { SYSTEM_VARS } from '@/constants/system';
import { useProjectConfig } from '@/store';

import { QuoteOptionContainer } from './style';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

enum ListType {
  env,
  global,
  inner,
}

const Index = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const globalVars = useProjectConfig((state) => state.globalVars);
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const [index, setIndex] = useState(0);

  const list = useMemo(() => {
    const currentEnv = find(envList, (item) => item.env_id === envDetailKeys);
    const envVarList = map(entries(currentEnv?.env_var_list), ([key, obj]: any) => ({
      key,
      value: isString(obj?.current_value) ? obj?.current_value : JSON.stringify(obj?.current_value),
      type: ListType.env,
    }));
    const globalVarList = map(entries(globalVars), ([key, obj]:any) => ({
      key,
      value: isString(obj?.current_value) ? obj?.current_value : JSON.stringify(obj?.current_value),
      type: ListType.global,
    }));
    const systemVarList = map(entries(SYSTEM_VARS), ([key, value]) => ({
      key: `$${key}`,
      value,
      type: ListType.inner,
    }));
    return filter(
      concat(envVarList, globalVarList, systemVarList),
      (item) => (item?.key as string)?.toLowerCase().includes(value?.toLowerCase() || '')
    );
  }, [value, globalVars, envList, envDetailKeys]);

  return (
    <QuoteOptionContainer>
      {size(list) ? (
        <>
          <div className="list">
            {map(list, (item, index) => (
              <div
                className="list-item"
                onFocus={() => setIndex(index)}
                onMouseOver={() => setIndex(index)}
                onMouseDown={() => {
                  onChange(item.key);
                  setIndex(index);
                }}
              >
                <div
                  className={classNames('list-item-icon', {
                    e: item?.type === ListType.env,
                    g: item?.type === ListType.global,
                  })}
                >
                  {item?.type === ListType.env ? 'E' : 'G'}
                </div>
                <div className="list-item-key">
                  <Tooltip title={item.key}>{item.key}</Tooltip>
                </div>
              </div>
            ))}
          </div>
          <div className="content">
            {list[index] && (
              <>
                <Flex gap={4} vertical>
                  <span className="label">{t('supplement.var_name')}</span>
                  <span className="value">{list[index]?.key || ''}</span>
                </Flex>
                <Flex gap={4} vertical>
                  <span className="label">{t('supplement.var_value')}</span>
                  <span className="value">{list[index]?.value || ''}</span>
                </Flex>
                <Flex gap={4} vertical>
                  <span className="label">{t('supplement.scope')}</span>
                  <span className="value">
                    {list[index]?.type === ListType.env
                      ? t('supplement.var_env')
                      : t('supplement.var_glo')}
                  </span>
                </Flex>
              </>
            )}
          </div>
        </>
      ) : (
        <Empty wrapStyle={{ width: '100%' }} />
      )}
    </QuoteOptionContainer>
  );
};

export default Index;
