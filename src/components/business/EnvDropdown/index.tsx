import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Dropdown, DropdownProps, Flex, Input, MenuProps, Skeleton } from 'antd';

import { useSafeState } from 'ahooks';
import classNames from 'classnames';
import { get, map } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { getProjectConfig, openEnvPage } from '@/events/apis/env';
import { useApis, useProjectConfig } from '@/store';
import { EnvListItem } from '@/types/envManage';

import { EnvDropdownRenderContainer, EnvDropdownWrapper, EnvLabel } from './style';

type EnvDropdownProps = {
  value: string;
  onEnvClick: MenuProps['onClick'];
  isApis?: boolean;
  disabled?:boolean;
  style?:any;
};

const EnvDropdown: React.FC<EnvDropdownProps> = ({
  value,
  onEnvClick,
  isApis = false,
  disabled=false,
  style
}: EnvDropdownProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useSafeState<boolean>(false);
  const [loading, setLoading] = useSafeState<boolean>(false);
  const [filterValue, setFilterValue] = useSafeState<string>('');
  const envList = useProjectConfig((state) => state.envList);
  const updateEstablish = useProjectConfig((state) => state.updateEstablish);
  const updateEnvSettingKeys = useProjectConfig((state) => state.updateEnvSettingKeys);
  const { apisActiveKey } = useApis(
    useShallow((state) => ({
      apisActiveKey: state.apisActiveKey,
    }))
  );
  const apisData = useApis(
    (state) => state.opensApiDetailsData[apisActiveKey] || state.apiBaseData[apisActiveKey]
  );

  const envDetails = useMemo(() => {
    return envList?.find((e) => e.env_id === value) || get(envList, '[0]');
  }, [envList, value]);

  const filterList = useMemo(() => {
    return envList.filter(
      (d) => `${d.name}`.toLowerCase().indexOf(`${filterValue}`.toLowerCase()) !== -1
    );
  }, [filterValue, envList]);

  const envDisabled = useMemo(() => {
    if ((isApis && apisData?.target_type === APIS_TARGET_TYPE_ENUM.WEBSOCKET) || disabled) {
      return true;
    }
    return false;
  }, [isApis, apisData]);

  const envCreate = async () => {
    updateEstablish(true);
    setOpen(false);
    openEnvPage({
      create:true
    });
  };

  const onOpenChange: DropdownProps['onOpenChange'] = async (open) => {
      // Fetch latest data when opening
      if(open){
        getProjectConfig();
      }
      setOpen(open);
      if (open) {
        setLoading(false);
      } else {
        setFilterValue('');
      }
  };

  const dropdownRender: DropdownProps['dropdownRender'] = (menu) => {
    return (
      <EnvDropdownRenderContainer>
        {loading ? (
          <Skeleton style={{ padding: '0 16px' }} active paragraph={{ rows: 10 }} loading />
        ) : (
          <>
            <Input
              className="env-popover-input"
              placeholder={t('supplement.env_input_tip')}
              prefix={<IconFont type="icon-search-line" />}
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
            />
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Flex style={{ padding: '4px 0' }}>
              <Button
                onClick={envCreate}
                icon={<IconFont type="icon-circle-add" />}
                type="link"
                size="small"
                className="add-env-btn"
              >
                {t('supplement.env_create')}
              </Button>
            </Flex>
          </>
        )}
      </EnvDropdownRenderContainer>
    );
  };

  const dropdownMenuRender = ({
    env_id,
    name,
    is_private,
  }: Omit<EnvListItem, 'server_list' | 'env_var_list'>) => {
    return (
      <EnvLabel>
        <Flex className="menu-item-wrap" align="center" justify="space-between">
          <Tooltip placement="bottom" title={name}>
            <span className="name">
              {name}
              {is_private === 1 && <span className="private">{t('supplement.pvt')}</span>}
            </span>
          </Tooltip>
          <Flex gap={8} align="center" className="operate-wrap">
            <IconFont
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                 // Open environment page
                openEnvPage({
                  env_id
                });

                updateEnvSettingKeys(env_id);
              }}
              type="icon-settings"
            />
          </Flex>
        </Flex>
      </EnvLabel>
    );
  };

  return (
    <EnvDropdownWrapper style={style} className={classNames(envDisabled && 'env-dropdown-disabled')} align="center">
      <Dropdown
        disabled={envDisabled}
        menu={{
          items: map(filterList, ({ env_id, name, is_private, isLocal }) => ({
            key: env_id,
            label: dropdownMenuRender({ env_id, name, is_private, isLocal }),
          })),
          selectable: true,
          onClick: onEnvClick,
          selectedKeys: [value],
        }}
        onOpenChange={onOpenChange}
        open={open}
        dropdownRender={dropdownRender}
        className="env-select-wrap"
        trigger={['click']}
      >
        <Flex
          id="tour-version-once"
          style={{ height: '100%', width: '100%' }}
          gap={4}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap={4}>
            <IconFont
              className="env-select-setting"
              onClick={(e) => {
                if (envDisabled) return;
                e.stopPropagation();
                setOpen(false);
                // Open environment page
                 openEnvPage({
                  env_id:value
                });
                updateEnvSettingKeys(value);
              }}
              style={{ fontSize: 12, color: 'var(--icon-color)' }}
              type="icon-settings"
            />
            <span className="title">
              <Tooltip title={envDetails?.name}>
                <i className="name">{envDetails?.name}</i>
              </Tooltip>
            </span>
          </Flex>
          <IconFont type="icon-drop-down" style={{color:'var(--icon-color)'}} />
        </Flex>
      </Dropdown>


      <div
        onClick={() => {
          if (envDisabled) return;
          setOpen(false);
          openEnvPage({cookie:true});
        }}
        className="icon-manage-env"
      >
        <IconFont type="icon-environment-control" />
      </div>
    </EnvDropdownWrapper>
  );
};

export default EnvDropdown;
