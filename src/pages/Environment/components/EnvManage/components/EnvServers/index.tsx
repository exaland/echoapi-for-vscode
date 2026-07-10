import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, message } from 'antd';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep, findIndex, isEqual, size, sortBy } from 'lodash';

import Table from '@/components/business/BasicTable';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import { Modal } from '@/components/ui/Modal';

import { EnvListItem } from '@/types/envManage';

import ItemMenu from './components/ItemMenu';
import ServerPop from './components/ServerPop';

import {
  EnvAddContainer,
  EnvServerContainer,
  EnvServerTitleContainer,
  ServerNameContainer,
} from './style';
import { useProjectConfig } from '@/store';
import { snowflakeId } from 'apipost-tools';
import { saveProjectConfig } from '@/events/apis/env';

interface Props {
  value: EnvListItem;
  onChange: React.Dispatch<EnvListItem>;
  updateEnv: (p: any, serverUpdate?: boolean) => void;
}

const Index = (props: Props) => {
  const { t } = useTranslation();

  const serverList = useProjectConfig((state) => state.serverList);

  const updateServerList = useProjectConfig((state) => state.updateServerList);
  const [modalType, setModalType] = useState<'add' | 'modify'>('add');
  const [serverId, setServerId] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const { value, onChange, updateEnv } = props;
  const [modal, contextHolder] = Modal.useModal();

  const isMockEnv = isEqual(value?.env_id, '2');

  const dataList = useMemo(() => {
    if (value?.server_list) {
      return sortBy(value?.server_list, ['sort']);
    }
    return [];
  }, [value.server_list]);

  const handleDeleteServer = (server_id: string) => {
    // Confirm deletion
    modal.confirm({
      title: t('supplement.del_tip'),
      content: t('supplement.del_sync_del'),
      onOk: async () => {
        try {
          const newServerList = serverList.filter(i => i?.server_id !== server_id)
          // Delete service
          updateServerList(newServerList);

          saveProjectConfig('serverList', newServerList)
          message.success('Success');

          const server_list = dataList?.filter((e) => e.server_id !== server_id);
          updateEnv({
            ...value,
            server_list,
          });
        } catch (err) {
          /* empty */
        }
      },
    });
  };

  const handleDefaultServer = (server_id: string) => {
    try {
      const newServerList = cloneDeep(serverList);

      newServerList.forEach(i => {
        if (i.server_id === server_id) {
          i.is_default = 1;
        } else {
          i.is_default = -1;
        }
      });
      updateServerList(newServerList);
      saveProjectConfig('serverList', newServerList);
      message.success('Success');

    } catch (err) {
      /* empty */
    }
  }

  const handleChangeEnvServer = (key: any, newUrl: any) => {
    // Mock environment cannot be modified
    if (isMockEnv) {
      return;
    }

    const newList = value.server_list.map((e) =>
      e.server_id === key ? { ...e, uri: newUrl } : { ...e }
    );
    onChange({
      ...value,
      server_list: newList,
    });

  };

  const columns = [
    {
      title: t('global_setting.environment_detail.server_name'),
      dataIndex: 'name',
      width: 320,
      enableResize: true,
      ellipsis:true,
      render: (text: any, rowData: any) => (
        <ServerNameContainer>
          <div className="env-name">
            <span>{text}</span>
            {rowData?.is_default === 1 && (
              <span className="icon-default">
                {t('global_setting.environment_detail.default_tag')}
              </span>
            )}
          </div>
          <ItemMenu
            enableDel={rowData?.is_default !== 1}
            onDelete={() => handleDeleteServer(rowData?.server_id)}
            onModify={() => {
              setServerId(rowData.server_id);
              setName(rowData.name);
              setModalType('modify');
              setOpen(true);
            }}
            onDefault={() => {
              handleDefaultServer(rowData?.server_id);
            }}
          />
        </ServerNameContainer>
      ),
    },
    {
      title: t('global_setting.environment_detail.url'),
      dataIndex: 'uri',
      render: (text: any, rowData: any) => (
        <Input
          size="middle"
          disabled={isMockEnv}
          value={text}
          maxLength={255}
          onChange={(e) => handleChangeEnvServer(rowData.server_id, e.target.value)}
        />
      ),
    },
  ];

  const onConfirm = async (name: string, edit_server_id?: string) => {
    try {
      if (edit_server_id) {
        // Modify service
        const newServerList = cloneDeep(serverList);
        newServerList.forEach(i => {
          if (i?.server_id === edit_server_id) {
            i.name = name;
          }
        });
        updateServerList(newServerList);

        saveProjectConfig('serverList', newServerList);
        message.success('Success');

      } else {
        // Add new service
        const newServerList = cloneDeep(serverList);
        const newServer = {
          name,
          server_id: snowflakeId(),
          uri: '',
          sort: serverList.reduce((max, obj) => (obj?.sort || 0) > max ? (obj?.sort || 0) : max, 0) + 1,
        };
        newServerList.push(newServer);

        updateServerList(newServerList);

        saveProjectConfig('serverList', newServerList);
        message.success('Success');

      }

      setOpen(false);
    } catch (err) {
      // err
    }
  };

  const handleMoveServer = (activeId: string, beforeId: string, afterId: string) => {
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (isEqual(active.id, over?.id)) return;

    const activeIndex = findIndex(dataList, (i) => i.server_id === active.id);
    const overIndex = findIndex(dataList, (i) => i.server_id === over?.id);
    const newEnvList = arrayMove(dataList || [], +activeIndex, +overIndex);
    const newActiveIndex = findIndex(newEnvList, (i) => i.server_id === active.id);

    // Move to the end
    if (isEqual(size(dataList) - 1, newActiveIndex)) {
      const beforeId = newEnvList[newActiveIndex - 1].server_id;
      handleMoveServer(`${active.id}`, beforeId, '0');
      return;
    }

    const afterId = newEnvList[newActiveIndex + 1].server_id;
    handleMoveServer(`${active.id}`, '0', afterId);
  };

  return (
    <EnvServerContainer>
      <ServerPop
        value={name ?? ''}
        onCancel={() => setOpen(false)}
        open={open}
        type={modalType}
        onConfirm={(name: string) => {
          if (modalType === 'modify') {
            onConfirm(name, serverId);
          } else {
            onConfirm(name);
          }
        }}
      />
      <EnvServerTitleContainer>
        <span style={
          {
            color:'var(--font-title-color)'
          }
        }>{t('global_setting.environment_detail.server')}</span>
        {!isMockEnv && (
          <Button
            type="text"
            icon={
              <EnvAddContainer>
                <IconFont type="icon-circle-add" />
              </EnvAddContainer>
            }
            onClick={() => {
              setModalType('add');
              setName('');
              setOpen(true);
            }}
          >
            <span className="server-add">{t('global_setting.environment_detail.add_server')}</span>
          </Button>
        )}
      </EnvServerTitleContainer>
      <Table
        rowKey="server_id"
        pagination={false}
        columns={columns}
        dataSource={dataList}
        onDragEnd={onDragEnd}
      />
      {contextHolder}
    </EnvServerContainer>
  );
};

export default Index;
