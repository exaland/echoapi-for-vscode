import { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Collapse, Flex, Input, Select, Space, Tag } from 'antd';

import cn from 'classnames';
import { concat, filter, isEqual, map, size, trim } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import BasicTable from '@/components/business/BasicTable';
import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { FIELD_TYPES, STATUS_CODE } from '@/constants/common';
import { editFolder } from '@/events/apis/action/folder';
import { useApis, useProjectConfig, useSystemConfig, useUserConfig } from '@/store';
import { ApisBaseDataItem } from '@/types/apis/base';
import { ApisItemActionType } from '@/types/apis/other';
import { DefaultRequestSystemHeaders } from '@/types/apis/request';
import { GlobalParamsHeaderItem } from '@/types/project';

import { RequestTableProps } from '../../types';

import { BasicTableContainer } from './style';
import { ENV_MANAGE_ENUM } from '@/pages/Environment/constants';

type Props = Pick<
  RequestTableProps,
  'globalParams' | 'folderParams' | 'paramsType' | 'tabType' | 'isSystem' | 'columnSwitchConfig'
>;

const PublicParamsTable: FC<Props> = memo(
  ({
    globalParams = [],
    folderParams = [],
    paramsType,
    tabType,
    isSystem = false,
    columnSwitchConfig,
  }) => {
    const { t } = useTranslation();
    const { apiDetailsData } = useApis(
      useShallow(({ apiDetailsData }) => ({
        apiDetailsData,
      }))
    );
    const systemConfig = useSystemConfig((state) => state.systemConfig);
    const systemRequestHeader = systemConfig?.systemRequestHeader || [];
    
    const updateSystemConfig = useSystemConfig((state) => state.updateSystemConfig);

    const projectId = useUserConfig((state) => state.currentProject.project_id);
    const lastDataSource = useMemo(() => {
      let commonParameters: (GlobalParamsHeaderItem | ApisBaseDataItem)[] = [];

      const newGlobalParams = map(globalParams, (it) => ({ ...it, type: 'global' }));
      const newFolderParams = map(folderParams, (it) => ({ ...it, type: 'folder' }));

      if (paramsType !== 'global') {
        commonParameters = concat(commonParameters, newGlobalParams);
      }

      commonParameters = concat(commonParameters, newFolderParams);
      if (tabType === 'header') {
        commonParameters = concat(
          commonParameters,
          map(systemRequestHeader as GlobalParamsHeaderItem[], (it) => ({
            ...it,
            type: 'system',
          }))
        );
      }
      return filter(commonParameters, (item) => trim(item?.key) !== '') || [];
    }, [globalParams, folderParams, paramsType, systemRequestHeader]);
    const { updateEnvOpen, updateEnvSettingKeys } = useProjectConfig(
      useShallow(({ updateEnvOpen, updateEnvSettingKeys }) => ({
        updateEnvOpen,
        updateEnvSettingKeys,
      }))
    );

    const columns = [
      {
        key: 'handle',
        dataIndex: 'handle',
        title: '',
        width: 34,
        render: (_text: string) => {
          return null;
        },
      },
      {
        key: 'is_checked',
        dataIndex: 'is_checked',
        title: '',
        width: 24,
        render: (text: number, rowData: any) => {
          return (
            <Checkbox
              onChange={(e) => {
                const systemHeader: DefaultRequestSystemHeaders[] = map(
                  systemRequestHeader,
                  (el) => {
                    if (el?.key === rowData?.key) {
                      return { ...el, is_checked: e?.target?.checked ? 1 : -1 };
                    }
                    return el;
                  }
                );
                updateSystemConfig({ ...systemConfig, systemRequestHeader: systemHeader });

                window?.vscode.postMessage({
                  action: 'setSystemConfig',
                  data:{ systemRequestHeader: systemHeader}
                });

                // updateSystemRequestHeader(systemHeader);
              }}
              disabled={rowData?.type !== 'system'}
              checked={text === 1}
            />
          );
        },
      },
      {
        key: 'key',
        dataIndex: 'key',
        title: t('common.request_table.param_name'),
        width: '35%',
        render: (text: string, rowData: any) => {
          return (
            <Flex>
              <Input style={{ paddingLeft: 0 }} disabled variant="borderless" value={text} />
              {!isEqual(columnSwitchConfig?.parameter_type, STATUS_CODE.DISABLE) && (
                <Select
                  style={{ minWidth: 120 }}
                  disabled
                  suffixIcon={
                    <div>
                      <IconFont type="icon-drop-down" style={{ pointerEvents: 'none' }} />
                      <div
                        style={{ pointerEvents: 'visible' }}
                        className={cn({
                          required: true,
                          checked: rowData?.not_null == 1,
                        })}
                      >
                        <Tooltip title={t('supplement.required')} placement="top">
                          <IconFont style={{ fontSize: 14 }} type="icon-fuhao" />
                        </Tooltip>
                      </div>
                    </div>
                  }
                  value={rowData?.field_type || ''}
                >
                  {FIELD_TYPES?.map((item: string) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Flex>
          );
        },
      },
      {
        key: 'value',
        dataIndex: 'value',
        title: t('common.request_table.param_value'),
        width: '33%',
        render: (text: string) => {
          return <Input disabled variant="borderless" value={text} />;
        },
      },

      {
        key: 'description',
        dataIndex: 'description',
        title: t('common.request_table.param_desc'),
        width: '33%',
        render: (text: string, row: any) => {
          return (
            <Flex align="center">
              <Input
                disabled
                variant="borderless"
                value={
                  !isEqual(columnSwitchConfig?.parameter_description, STATUS_CODE.DISABLE)
                    ? text
                    : ''
                }
              />
              <Space size={8} style={{ padding: '0 10px' }}>
                {row?.type !== 'system' && (
                  <IconFont
                    onClick={() => {
                      if (row?.type === 'global') {
                        updateEnvSettingKeys(ENV_MANAGE_ENUM.globalParm);
                        updateEnvOpen(true);
                      } else {
                        const actionFunParams: ApisItemActionType = {
                          apisData: apiDetailsData?.[row?.target_id],
                          projectId,
                          childTargetType: 'edit' as ApisItemActionType['childTargetType'],
                          tabsValue: 'params_settings',
                        };
                        editFolder(actionFunParams);
                      }
                    }}
                    className="global-param-edit"
                    type="icon-edit"
                  />
                )}

                {row?.type === 'global' || row?.type === 'system' ? (
                  <Tag bordered={false} color="processing">
                    {t('common.request_table.global')}
                  </Tag>
                ) : (
                  <Tag bordered={false} color="orange">
                    {t('common.request_table.folder')}
                  </Tag>
                )}
              </Space>
            </Flex>
          );
        },
      },
    ];

    if (size(lastDataSource) <= 0) {
      return null;
    }
    return (
      <BasicTableContainer>
        {size(lastDataSource) > 0 && (
          <Collapse
            ghost
            expandIcon={(panelProps) => {
              return (
                <>
                  {panelProps.isActive ? (
                    <IconFont type="icon-preview" />
                  ) : (
                    <IconFont type="icon-not-show" />
                  )}
                </>
              );
            }}
            className="table-collapse table-collapse-public"
            style={{ marginTop: -12 }}
            items={[
              {
                key: 'description',
                label: `${isSystem
                    ? `${t('common.request_table.system')}（header）`
                    : `${t('common.request_table.public_param')}（${tabType}）`
                  }`,
                children: (
                  <BasicTable
                    tableLayout="fixed"
                    rowKey="param_id"
                    bordered
                    showHeader={false}
                    cellPadding={0}
                    dataSource={lastDataSource}
                    columns={columns}
                  />
                ),
              },
            ]}
          />
        )}
      </BasicTableContainer>
    );
  }
);

export default PublicParamsTable;
