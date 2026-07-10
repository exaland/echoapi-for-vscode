import { FC } from 'react';

import FolderBaseSettings from '@/components/business/FolderSettings/BaseSettings';
import { FolderComponentType } from '@/types/apis/folder';

import { SettingsContainer } from './style';

const Settings: FC<FolderComponentType> = ({ apisData, onApisDataChange }) => {
  return (
    <SettingsContainer>
      <FolderBaseSettings value={apisData} onChange={onApisDataChange} />
    </SettingsContainer>
  );
};

export default Settings;
