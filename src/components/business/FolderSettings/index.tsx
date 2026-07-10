import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeState } from 'ahooks';

import { FolderDetailsData } from '@/types/apis/folder';

import SegmentedTabs from '../SegmentedTabs';
import BaseSettings from './BaseSettings';
import ParamsSettings from './ParamsSettings';

import { FolderSettingsContainer } from './style';

interface Props {
  value: FolderDetailsData;
  onChange: (value: FolderDetailsData) => void;
  tabsValue?: string;
}

const FolderSettings: FC<Props> = ({ value, onChange, tabsValue: defaultTabsValue }) => {
  const { t } = useTranslation();
  const [tabsValue, setTabsValue] = useSafeState<string>(defaultTabsValue || 'base_settings');

  const segmentedOptions = [
    {
      label: t('supplement.folder_set'),
      key: 'base_settings',
      value: 'base_settings',
      children: <BaseSettings value={value} onChange={onChange} />,
    },
    {
      label: t('supplement.folder_param'),
      key: 'params_settings',
      value: 'params_settings',
      children: <ParamsSettings value={value} onChange={onChange} />,
    },
  ];

  return (
    <FolderSettingsContainer>
      <SegmentedTabs
        options={segmentedOptions}
        value={tabsValue}
        onChange={(val) => setTabsValue(val as string)}
      />
    </FolderSettingsContainer>
  );
};

export default FolderSettings;
