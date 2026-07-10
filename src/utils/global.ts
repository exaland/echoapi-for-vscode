import { getI18n } from 'react-i18next';
import { getGlobals } from './send/utils';
import { useProjectConfig } from '@/store';
import { entries, find, has, merge } from 'lodash';
import { convertVarFormat } from './common';

export const getMonacoVariable = async (originKey: string) => {
  try {
    const { t } = getI18n();
    const keyName = originKey.substring(2, originKey.length - 2);
    const global = await getGlobals();
    const { envList, envDetailKeys } = useProjectConfig.getState();
    const currentEnv = find(envList, (item) => item.env_id === envDetailKeys);
    const environmentMap = entries(currentEnv?.env_var_list).reduce(
      (pre, [key, obj]: any) => {
        pre[key] = obj?.current_value || '';
        return pre;
      },
      {} as Record<string, any>
    );
    const varMap = merge(global, environmentMap);
    if (has(varMap, keyName)) {
      return `**${t('supplement.current_value')}**  **:** ${convertVarFormat(varMap[keyName])}`;
    }
  } catch (err) {
    return '';
  }
};