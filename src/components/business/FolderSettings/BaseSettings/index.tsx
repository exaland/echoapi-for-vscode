import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, InputRef, TreeSelect } from 'antd';

import { useDebounceEffect } from 'ahooks';
import produce from 'immer';

import { Editor as ByteMD } from '@/components/business/ByteMd';
import useFolders from '@/hooks/useFolders';
import { useApis } from '@/store';
import { FolderDetailsData } from '@/types/apis/folder';
import { ChangeFuncType } from '@/types/common';

import ServerSelect from './ServerSelect';

import { BaseSettingsContainer } from './style';
import { Empty } from '@/components/ui';

interface Props {
  value: FolderDetailsData;
  onChange: (value: FolderDetailsData) => void;
}

const BaseSettings: FC<Props> = ({ value, onChange }) => {
  const { apisFolders } = useFolders({ currentTargetId: value?.target_id });
  const apisActiveKey = useApis((state) => state.apisActiveKey);
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);
  
  const handleChange: ChangeFuncType<FolderDetailsData> = (key, newValue) => {
    
    const newApisData = produce(value, (draft) => {
      draft[key] = newValue;
    });

    onChange(newApisData);
  };

  useDebounceEffect(
    () => {
      if (apisActiveKey === value?.target_id && value?.is_create === 1 && !value?.description) {
        inputRef.current!.focus({
          cursor: 'end',
        });
      }
    },
    [apisActiveKey],
    { wait: 100 }
  );

  return (
    <BaseSettingsContainer>
      <div className="folder-base-config-wrap">
        <Flex justify="space-between" align="center" className="folder-save-wrap">
          <Input
            ref={inputRef}
            className="folder-base-input"
            maxLength={255}
            placeholder={t('supplement.folder')}
            value={value?.name}
            onChange={(event) => handleChange('name', event.target.value)}
          />
        </Flex>
        <Flex align="center" className="folder-config-wrap">
          <Flex className="folder-config-item-wrap" vertical>
            <span className="label">{t('folder.folder_setting.service')}</span>
            <ServerSelect
              value={value?.server_id}
              onChange={(value) => handleChange('server_id', value)}
            />
          </Flex>
          <Flex className="folder-config-item-wrap" vertical>
            <span className="label">{t('supplement.folder')}</span>
            <TreeSelect
              showSearch
              treeDefaultExpandAll
              placeholder={t('supplement.select_folder_tip')}
              style={{ width: '100%' }}
              filterTreeNode={(input, treeNode) => {
                return treeNode.name.includes(input);
              }}
              fieldNames={{
                label: 'name',
                value: 'target_id',
                children: 'children',
              }}
              value={value?.parent_id}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={apisFolders}
              onChange={(value) => handleChange('parent_id', value)}
              notFoundContent={
                <Empty
                  description='No Data'
                />
              }
            />
          </Flex>
        </Flex>
      </div>
      <Flex className="folder-content-wrap" flex={1} vertical gap={16}>
        <div className="byte-md-wrap">
          <ByteMD
            value={value?.description}
            onChange={(value) => handleChange('description', value)}
          />
        </div>
      </Flex>
    </BaseSettingsContainer>
  );
};

export default BaseSettings;
