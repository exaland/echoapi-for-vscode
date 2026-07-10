import { FC } from 'react';

import { useMemoizedFn } from 'ahooks';

import RequestGlobal from '@/components/business/RequestGlobal';
import { FolderDetailsData } from '@/types/apis/folder';

import { ParamsSettingsContainer } from './style';

interface Props {
  value: FolderDetailsData;
  onChange: (value: FolderDetailsData) => void;
}

const ParamsSettings: FC<Props> = ({ value, onChange }) => {
  const handleOnChange = useMemoizedFn((data: FolderDetailsData['request']) => {
    onChange({ ...value, request: data });
  });

  return (
    <ParamsSettingsContainer>
      <RequestGlobal requestData={value.request} onRequestDataChange={handleOnChange} />
    </ParamsSettingsContainer>
  );
};

export default ParamsSettings;
