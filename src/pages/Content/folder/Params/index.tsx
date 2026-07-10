import { FC } from 'react';

import FolderParamsSettings from '@/components/business/FolderSettings/ParamsSettings';
import { FolderComponentType } from '@/types/apis/folder';

import { ParamsContainer } from './style';

const Params: FC<FolderComponentType> = ({ apisData, onApisDataChange }) => {
  return (
    <ParamsContainer>
      <FolderParamsSettings value={apisData} onChange={onApisDataChange} />
    </ParamsContainer>
  );
};

export default Params;
