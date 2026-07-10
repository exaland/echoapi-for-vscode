import { useTranslation } from 'react-i18next';

import {
  Flex, //Input,
  InputNumber,
  Select,
  Switch, // Select
} from 'antd';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { isEqual, map } from 'lodash';

import { Input } from '@/components/ui';
import useTheme from '@/hooks/useTheme';

import { SettingWrap } from './style';

interface Props {
  value: any;
  onChange: (data: any) => void;
  readOnly?: boolean;
}
const Setting = (props: Props) => {
  const { t } = useTranslation();
  const { value, readOnly, onChange } = props || {};
  const { themeToken } = useTheme();
  const handleConfig = useMemoizedFn((key: string, val: any) => {
    const newData = produce(value, (draft: any) => {
      draft[key] = val;
    });

    onChange(newData);
  });

  const SETTING_MAP_LIST = [
    {
      key: 'certificate_verification',
      title: t('ws.settings.certificate_verification'),
      desc: t('ws.settings.certificate_verification_tip'),
      children: (
        <Switch
          disabled={readOnly}
          checked={isEqual(value?.certificate_verification, 1)}
          onChange={(val) => handleConfig('certificate_verification', val ? 1 : -1)}
        />
      ),
    },
    {
      key: 'socket_version',
      title: t('ws.settings.client'),
      desc: t('ws.settings.handshake_tip'),
      children: (
        <Select
          disabled={readOnly}
          value={value?.socket_version}
          onChange={(val) => handleConfig('socket_version', val)}
        >
          <Select.Option value="v2">v2</Select.Option>
          <Select.Option value="v3">v3</Select.Option>
          <Select.Option value="v4">v4</Select.Option>
        </Select>
      ),
    },
    {
      key: 'shake_hands_path',
      title: t('ws.settings.handshake'),
      desc: t('ws.settings.handshake_tip'),
      children: (
        <Input
          maxLength={255}
          readOnly={readOnly}
          value={value?.shake_hands_path || ''}
          onChange={(e) => handleConfig('shake_hands_path', e?.target?.value || '')}
        />
      ),
    },
    {
      key: 'shake_hands_timeout',
      title: t('ws.settings.time_out'),
      desc: t('ws.settings.time_out_tip'),
      children: (
        <InputNumber
          readOnly={readOnly}
          controls={false}
          addonAfter="ms"
          value={value?.shake_hands_timeout}
          onChange={(val) => handleConfig('shake_hands_timeout', val)}
        />
      ),
    },

  ];
  return (
    <SettingWrap $token={themeToken}>
      <Flex style={{ marginLeft: 8 }} vertical gap={12}>
        {map(SETTING_MAP_LIST, (it) => (
          <>
            {
              <Flex key={it.key} gap={12} align="center">
                <Flex flex={1} vertical>
                  <div className="setting-title">{it.title}</div>
                  <div className="setting-desc">{it.desc}</div>
                </Flex>
                <Flex flex={0.1} style={{ minWidth: 120 }} align="start" justify="start">
                  {it.children}
                </Flex>
              </Flex>
            }
          </>
        ))}
      </Flex>
    </SettingWrap>
  );
};

export default Setting;
