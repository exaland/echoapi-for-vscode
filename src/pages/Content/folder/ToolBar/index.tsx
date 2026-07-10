import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, MenuProps } from 'antd';

import { useSafeState } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash';

import { Button, IconFont } from '@/components/ui';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';

import { useApis, useProjectConfig, useUserConfig } from '@/store';
import EnvDropdown from '@/components/business/EnvDropdown';
import { saveProjectConfig } from '@/events/apis/env';


interface Props {
  targetId?: string;
}

const ToolBar: FC<Props> = ({ }) => {
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useSafeState(false);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const updateEnvDetailKeys = useProjectConfig((state) => state.updateEnvDetailKeys);
  const apisData = useApis(store => store.apisActiveData);

  const isReadonly = useUserConfig((state) => state.isReadonly);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const result = cloneDeep(apisData);
      // await saveApis({ data: result });
      window?.vscode.postMessage({
        action: 'saveApiData',
        data: result
      });
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const envClick: MenuProps['onClick'] = ({ key }) => {
    // Switch environment
    updateEnvDetailKeys(key);
    saveProjectConfig('envDetailKeys', key);
  };


  if (isEqual(apisData?.target_type, APIS_TARGET_TYPE_ENUM.FOLDER)) {
    return (
      <Flex justify="flex-end" gap={8}>
        <Flex style={{ height: 26 }}>
          <EnvDropdown value={envDetailKeys} onEnvClick={envClick} />
        </Flex>
        <Button
          size="small"
          type="primary"
          loading={saveLoading}
          disabled={isReadonly}
          onClick={handleSave}
        >
          {t('api.mock.expectation_set.save')}
        </Button>
      </Flex>
    );
  }

  return (
    <></>
  );
};

export default ToolBar;
