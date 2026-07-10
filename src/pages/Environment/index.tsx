import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { IconFont } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { LeftMenuContainer, Render, EnvironmentContainer } from './style.ts';
import { ENV_LOCAL_ITEM, ENV_MANAGE_ENUM } from './constants';
import CookieManage from './components/CookieManage';
import EnvManage from './components/EnvManage';
import ParamsManage from './components/ParamsManage';
import VariableManage from './components/VariableManage';
import { head } from 'lodash';
import Menus from './Menus';
import { useProjectConfig } from '@/store';
import { snowflakeId } from 'apipost-tools';

interface Props {
  open: boolean;
}
const Environment = (props: Props) => {
  const { open } = props;
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const serverList = useProjectConfig((state) => state.serverList);
  const {
    envList,
    envSettingKeys,
    globalParamsTabKey,
    establish,
    updateEnvList,
    updateEnvOpen,
    updateEstablish,
    updateEnvSettingKeys,
  } = useProjectConfig();
  
  useEffect(() => {
    
    if (open) {
      // setSelectedKeys([ENV_MANAGE_ENUM.cookie]);
      envMenusInit();
    } else {
      updateEnvList(envList?.filter((e) => !e.isLocal));
      updateEnvSettingKeys('');
    }
  }, [open, envSettingKeys]);

  const envMenusInit = async () => {
    try {
     if (envSettingKeys) {
        if (
          [
            ENV_MANAGE_ENUM.cookie,
            ENV_MANAGE_ENUM.globalParm,
            ENV_MANAGE_ENUM.globalVariable,
          ].includes(envSettingKeys as ENV_MANAGE_ENUM) || 
          envList.some((e) => e.env_id === envSettingKeys)
        ) {
          setSelectedKeys([envSettingKeys]);
        }else{
          setSelectedKeys([ENV_MANAGE_ENUM.cookie]);
        }
      } else {
        setSelectedKeys([ENV_MANAGE_ENUM.cookie]);
      }
      if (establish) {
        envCreate();
      }
    } catch (err) {
      // updateEnvList([]);
    }
  };
  useEffect(() => {
    if (establish) {
      envCreate();
    }
  }, [establish]);
  const envCreate = async () => {
    updateEstablish(false);
    try {
      if (envList?.some((e) => e.isLocal)) return;
      const info = {
        ...ENV_LOCAL_ITEM,
        server_list: serverList?.map((e) => ({ ...e, uri: '' })),
        env_id: snowflakeId(),
      };
      setSelectedKeys([info.env_id]);
      updateEnvList([...envList, info]);
    } catch (err) {
      // err
    }
  };

  return (
    <EnvironmentContainer>
      <LeftMenuContainer>
        <div className="env-menu-top">
          <Menus selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
        </div>
        <Button
          className="env-menu-new"
          onClick={envCreate}
          type="dashed"
          icon={<IconFont type="icon-add-line" />}
        >
          {t('global_setting.create')}
        </Button>
      </LeftMenuContainer>

      <Render>
        {head(selectedKeys) === ENV_MANAGE_ENUM.cookie && <CookieManage />}
        {head(selectedKeys) === ENV_MANAGE_ENUM.globalParm && <ParamsManage defaultTabKey={globalParamsTabKey}/>}
        {head(selectedKeys) === ENV_MANAGE_ENUM.globalVariable && <VariableManage />}
        {![
          ENV_MANAGE_ENUM.cookie,
          ENV_MANAGE_ENUM.globalParm,
          ENV_MANAGE_ENUM.globalVariable,
        ].includes(head(selectedKeys)) && (
            <EnvManage
              changeKey={setSelectedKeys}
              editEnvId={head(selectedKeys)}
              envMenus={envList}
            />
          )}
      </Render>
    </EnvironmentContainer>
  )
}

export default Environment
