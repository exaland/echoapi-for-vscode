import { find, isEmpty } from 'lodash';
import Mock from 'mockjs';

import { useProjectConfig } from '@/store';
import { EnvListItem } from '@/types/envManage';

// For API calls
const useVarReplaces = () => {
  const globalVars = useProjectConfig((state) => state.globalVars);
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);

  // Variable replacement
  const varReplace = (_val: string, option?: any) => {
    const { mock } = option || { mock: true };
    const currentEnv: EnvListItem =
      find(envList, (item) => item.env_id === envDetailKeys) || ({} as EnvListItem);
    if (typeof _val !== 'string') {
      return _val;
    }

    // mock
    if (_val === null) {
      return '';
    }

    if (typeof _val === 'string' && mock) {
      const _matches = _val.match(/{{\$([a-zA-Z0-9_]+).*?}}/gi);
      // Replace mock syntax within variables.
      if (_matches instanceof Array) {
        for (const _match of _matches) {
          let mock_rule = _match.replace(/{{\$([a-zA-Z0-9_]+).*?}}/gi, '@$1');

          // for 5.3.2
          try {
            mock_rule = Mock.mock(mock_rule);
          } catch (e) {
            //
          }
          _val = _val.replace(_match, mock_rule);
        }
      }
    }

    if (_val.toString().indexOf('{{') === -1) {
      return _val;
    }

    if (currentEnv && !isEmpty(currentEnv)) {
      for (const _x in currentEnv.env_var_list) {
        if (_x !== '') {
          let _reg: any = false;

          try {
            _reg = new RegExp(`[{][{]${_x}[}][}]`, 'g');
          } catch (e) {
          }
          if (
            _reg &&
            typeof currentEnv.env_var_list[_x].current_value !== 'undefined' &&
            typeof _val === 'string'
          ) {
            _val = _val.replace(_reg, currentEnv.env_var_list[_x].current_value);
          }
        }
      }
    }

    // Check global variables
    if (globalVars && !isEmpty(globalVars)) {
      for (const _x in globalVars) {
        if (_x !== '') {
          let _reg: any = false;

          try {
            _reg = new RegExp(`[{][{]${_x}[}][}]`, 'g');
          } catch (e) {
          }

          if (_reg && typeof globalVars[_x] !== 'undefined' && typeof _val === 'string') {
            _val = _val.replace(_reg, globalVars[_x]);
          }
        }
      }
    }

    return _val;
  };

  return {
    varReplace,
  };
};

export default useVarReplaces;
