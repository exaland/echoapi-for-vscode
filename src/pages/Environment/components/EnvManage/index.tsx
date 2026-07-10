import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, message, Tooltip } from 'antd';

import { useLatest, useUpdateEffect } from 'ahooks';
import produce from 'immer';
import { cloneDeep, find, findIndex, isNull, isUndefined, keys, map } from 'lodash';

import Table from '@/components/business/BasicTable';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import { saveProjectConfig, updateEnvServerList } from '@/events/apis/env';
import { useProjectConfig } from '@/store';
import { EnvList, EnvListItem } from '@/types/envManage';
import { openUrl } from '@/utils/open';

import { DEFAULT_DATA_ITEM } from '../../constants';
import ValueInput from '../ValueInput';
import EnvServers from './components/EnvServers';
import { IEnvDataItem } from './types';

import { EnvManageContainer, EnvOpContainer, TitleContainer } from './style';

interface EnvModifyModalProps {
  editEnvId: string | undefined;
  envMenus: EnvList;
  changeKey: React.Dispatch<string[]>;
}


const Index = (props: EnvModifyModalProps) => {
  const { t } = useTranslation();
  const { editEnvId, envMenus } = props;

  const updateEnvList = useProjectConfig((state) => state.updateEnvList);
  const serverList = useProjectConfig((state) => state.serverList);
  
  const [envData, setEnvData] = useState<Partial<EnvListItem>>({});
  const [envList, setEnvList] = useState<Array<IEnvDataItem>>([{ ...DEFAULT_DATA_ITEM }]);
  const readonly = false;
  const latestEnvDataRef = useLatest(envData);

  useEffect(() => {
    const data = find(envMenus, ({ env_id }) => env_id === editEnvId) as EnvListItem;

    if (!data) return;

    if (latestEnvDataRef.current?.env_id !== editEnvId) {
      setEnvData({ ...data });
      return;
    }

    setEnvData({
      ...data,
      server_list: map(data.server_list, (serverItem) => {
        const _serverItem = find(
          latestEnvDataRef.current.server_list,
          (findItem) => findItem.server_id === serverItem.server_id
        );

        return {
          ...serverItem,
          uri: _serverItem?.uri || '',
        };
      }),
    });
  }, [editEnvId, envMenus]);

  useEffect(() => {
    const data = find(envMenus, ({ env_id }) => env_id === editEnvId) as EnvListItem;
    if (data) {
      const list = keys(data.env_var_list).map((e: any) => ({
        key: e,
        ...data.env_var_list[e],
      }));
      setEnvList(list);
    }
    
  }, [editEnvId, envMenus]);
  
  const isDefaultOrMockEnv = () => {
    return envData.env_id === '1' || envData.env_id === '2';
  };

  const handleEnvChange = (key: string, value: string | number) => {
    const newEnv: any = cloneDeep(envData);
    const newEnvData = {
      ...newEnv,
      [key]: value,
    };
    setEnvData(newEnvData);

    // Add auto-save logic
    // onOk({envData:newEnvData});
  };

  const tableDataList = () => {
    const hasStatic = envList.some((item) => item.static);
    if (!hasStatic) {
      return [...envList, { ...DEFAULT_DATA_ITEM }];
    }
    return [...envList];
  };
  
  const handleItemChange = (rowData: any, index: number, newVal: any) => {
    const newList: Array<IEnvDataItem> = cloneDeep(envList);
    delete rowData.static;
    newList[index] = {
      ...rowData,
      ...newVal,
    };
    setEnvList([...newList]);

    // Add auto-save logic
    // onOk({
    //   envList:[...newList]
    // });
  };

  const handleDeleteItem = (index: number) => {
    const newList = [...envList];
    if (newList.length > 0) {
      newList.splice(index, 1);
      setEnvList([...newList]);
    }

    // Add auto-save logic
    // onOk({
    //   envList:[...newList]
    // });
  };

  const envColumn: any[] = [
    {
      title: t('global_setting.variables_table.variables'),
      width: 150,
      dataIndex: 'key',
      enableResize: true,
      render: (text: any, rowData: any, rowIndex: number) => (
        <Input
          className="env-var-name"
          value={text}
          disabled={readonly}
          onChange={(e) => {
            handleItemChange(rowData, rowIndex, { key: e.target.value });
          }}
        />
      ),
    },
    {
      title: (
        <Flex gap={8}>
          <span>{t('global_setting.variables_table.cloud_value')}</span>
          <Tooltip title={t('global_setting.variables_table.cloud_tip')}>
            <IconFont type="icon-wenhao" />
          </Tooltip>
        </Flex>
      ),
      width: 150,
      dataIndex: 'value',
      enableResize: true,
      render: (text: any, rowData: any, rowIndex: number) => (
        <Flex style={{ width: '100%' }}>
          <ValueInput
            value={isNull(text) || isUndefined(text) ? '' : String(text)}
            disabled={readonly}
            onChange={(e) =>
              handleItemChange(rowData, rowIndex, {
                value: e,
              })
            }
          />
        </Flex>
      ),
    },
    {
      title: (
        <Flex gap={8}>
          <span>{t('global_setting.variables_table.local_value')}</span>
          <Tooltip title={t('global_setting.variables_table.local_tip')}>
            <IconFont type="icon-wenhao" />
          </Tooltip>
        </Flex>
      ),
      width: 150,
      dataIndex: 'current_value',
      enableResize: true,
      render: (text: any, rowData: any, rowIndex: number) => (
        <Flex style={{ width: '100%' }}>
          <ValueInput
            value={isNull(text) || isUndefined(text) ? '' : String(text)}
            disabled={readonly}
            onChange={(e) =>
              handleItemChange(rowData, rowIndex, {
                current_value: e,
              })
            }
          />
        </Flex>
      ),
    },
    {
      title: t('global_setting.variables_table.description'),
      dataIndex: 'description',
      render: (text = '', rowData: any, rowIndex: number) => (
        <ValueInput
          value={String(text ?? '')}
          disabled={readonly}
          onChange={(e) =>
            handleItemChange(rowData, rowIndex, {
              description: e,
            })
          }
        />
      ),
    },
    {
      title: '',
      dataIndex: 'del',
      align: 'center',
      width: 50,
      render: (_text: any, _rowData: any, rowIndex: number) =>
        readonly ? (
          <></>
        ) : (
          <EnvOpContainer>
            <IconFont onClick={() => handleDeleteItem(rowIndex)} type="icon-delete" />
          </EnvOpContainer>
        ),
    },
  ];


  const onOk = (options?:any) => {
    const tempEnvData = options?.envData || envData;

    if (!tempEnvData.name?.trim()) return;
    try {
      const envVarList = options?.envList || envList;
      const params = {
        ...tempEnvData,
        name: tempEnvData.name?.trim(),
      } as EnvListItem;
      const env_var_list = (envVarList as any).reduce((obj: any, e: any) => {
        if (e.key && e.key?.trim()) {
          obj[e.key] = e;
        }
        return obj;
      }, {});
      params.env_var_list = env_var_list;
      if (params?.isLocal) {
        delete params.isLocal;
        // Get maximum sort value
        const maxSort = envMenus.reduce((max, obj) => (obj?.sort || 0) > max ? (obj?.sort || 0) : max, 0);
        const list = envMenus.map((e) => {
          if (e.env_id === params?.env_id) {
            return { ...params, sort: maxSort + 1, isLocal: undefined };
          }
          return e;
        });
        updateEnvList(list);
        // changeKey([res.env_id]);
        saveProjectConfig('envList',list);
        message.success('Success');
        return;
      }
      const newList = envMenus.map((e) => {
        if (e.env_id === params?.env_id) {
          return { ...params };
        }
        return e;
      });
      saveProjectConfig('envList',newList);
      message.success('Success');
      // await updateEnvRequest({ ...params, project_id: project_id || '' });
      updateEnv({ ...params }, false);
    } catch (err) {
      
      // err
    }
  };
  useUpdateEffect(()=>{
    updateEnvServerList(serverList);
  },[serverList]);
  const updateEnv = async (envData: any, serverUpdate = true) => {
    try {
      const newEnvList = produce(envMenus, (draft) => {
        const targetIndex = findIndex(draft, (e) => e.env_id === editEnvId);
        draft[targetIndex] = { ...draft[targetIndex], ...envData };
      });

      if (serverUpdate) {
        // Get service list
        await updateEnvServerList(serverList);
      } else {
        updateEnvList(newEnvList);
      }
    } catch (err) {
      // err
    }
  };

  return (
    <EnvManageContainer>
      <Flex className="env-manage-flex" vertical gap={15}>
        <Flex gap={15} vertical>
          <span className="title"> {t('global_setting.environment_detail.title')}</span>
          <div className="tip column">
            <div>
              {t('global_setting.environment_detail.tips')}
              <a
                onClick={() => openUrl('https://www.echoapi.com/wiki/docs/http/environment-variables')}
              >
                {t('global_setting.environment_detail.link')}
              </a>
            </div>
            <div>{t('global_setting.environment_detail.tips1')}</div>
            <div>{t('global_setting.environment_detail.tips2')}</div>
          </div>
        </Flex>
        <div className="env-manage-content">
          <TitleContainer>{t('global_setting.environment_detail.name')}</TitleContainer>
          <Input
            className="env-manage-input"
            maxLength={128}
            addonAfter={
              find(envMenus, ({ env_id }) => env_id === editEnvId)?.is_private === 1 ||
              find(envMenus, ({ env_id }) => env_id === editEnvId)?.isLocal
                ? undefined
                : undefined
            }
            placeholder={t('supplement.env_input_tip')}
            disabled={isDefaultOrMockEnv()}
            value={envData.name}
            onChange={(e) => handleEnvChange('name', e.target.value)}
          />
          <EnvServers value={envData as EnvListItem}           onChange={(newEnvData)=>{
            setEnvData(newEnvData);
            // Add auto-save logic
            // onOk({envData:newEnvData});
          }} updateEnv={updateEnv} />
          <TitleContainer>
            {t('global_setting.environment_detail.environment_variables')}
          </TitleContainer>
          <div>
            <Table
              pagination={false}
              rowKey={(_, i) => `${i}`}
              dataSource={tableDataList()}
              columns={envColumn}
            />
          </div>
        </div>

        <Flex justify="flex-end">
          <Button onClick={onOk} type="primary">
            {t('global_setting.environment_detail.save')}
          </Button>
        </Flex>
      </Flex>
    </EnvManageContainer>
  );
};

export default Index;
