import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, CheckboxProps, Flex, Form, Select, Tabs, TreeSelect, Typography } from 'antd';

import { filter, map, isArray } from 'lodash';

import { BasicTable, Tree } from '@/components/business';
import { Button, Empty, Tooltip } from '@/components/ui';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import useFolders from '@/hooks/useFolders';
import {
  APIPOST_FULL_ENV_OPTIONS,
  EXPORT_PREVIEW_CONFIG_ITEMS,
  ExportConfigEnum,
  IMPORT_TYPE_ENUM,
  ImportLocationEnum,
  SWAGGER_FULL_API_OPTIONS,
  SWAGGER_FULL_MODAL_OPTIONS,
} from '@/constants/settings';
import { ApiDetailsData } from '@/types/apis/api';
import { EnvList } from '@/types/envManage';
import { IDataModel } from '@/types/schemas';
import { arrayToTreeObject } from '@/utils/common';

import { LoadingContainer, PreviewContainer } from './style';

interface Props {
  open: boolean;
  onCancel: () => void;
  loading: boolean;
  data: {
    apis: ApiDetailsData[];
    models: IDataModel[];
    envs: EnvList;
  };
  onProjectImport: any;
  importLocation: ImportLocationEnum;
  fileType: IMPORT_TYPE_ENUM;
  previewSelectData: {
    apis: string[];
    models: string[];
    envs: string[];
  };
  setPreviewSelectData: any;
}

const Index = ({
  open,
  onCancel,
  data,
  loading,
  onProjectImport,
  importLocation,
  fileType,
  previewSelectData,
  setPreviewSelectData,
}: Props) => {
  const { t } = useTranslation();
  const { apisFolders } = useFolders();
  const apiCheckedKeys = useMemo(() => {
    return previewSelectData?.apis || [];
  }, [previewSelectData]);

  const setApiCheckedKeys = (apis: string[], e?: any) => {
    setPreviewSelectData({ ...previewSelectData, apis, apiHalfs: isArray(e?.halfCheckedKeys) ? e?.halfCheckedKeys : [] });
  };

  const modelCheckedKeys = useMemo(() => {
    return previewSelectData?.models || [];
  }, [previewSelectData]);

  const setModelCheckedKeys = (models: string[], e?: any) => {
    setPreviewSelectData({
      ...previewSelectData,
      models,
      modelHalfs: isArray(e?.halfCheckedKeys) ? e?.halfCheckedKeys : [],
    });
  };

  const columns = useMemo(() => {
    return [
      {
        title: t('global_setting.environment_detail.name'),
        width: '48%',
        ellipsis: true,
        dataIndex: 'name',
        render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: t('global_setting.environment_detail.url'),
        width: '50%',
        ellipsis: true,
        dataIndex: 'url',
        render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
      },
    ];
  }, []);
  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    
    if (e.target.checked) {
      setApiCheckedKeys(data?.apis?.map((i) => i.target_id));
    } else {
      setApiCheckedKeys([]);
    }
  };

  const onModelCheckAllChange: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      setModelCheckedKeys(data?.models?.map((i) => i.model_id));
    } else {
      setModelCheckedKeys([]);
    }
  };
  const onEnvCheckAllChange: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      setPreviewSelectData({ ...previewSelectData, envs: data?.envs?.map((i) => i.env_id) });
    } else {
      setPreviewSelectData({ ...previewSelectData, envs: [] });
    }
  };

  const rowSelectionChange = (_selectedRowKeys: string[]) => {
    setPreviewSelectData({ ...previewSelectData, envs: _selectedRowKeys });
  };

  const items = useMemo(() => {
    const dataSource = data?.envs?.map((item) => {
      return {
        name: item.name,
        env_id: item.env_id,
        url: '',
        children: item.server_list?.map((serverItem) => {
          return {
            name: serverItem.name,
            url: serverItem.uri,
          };
        }),
      };
    });

    const children = (key: ExportConfigEnum) => {
      if (key === ExportConfigEnum.request) {
        return data?.apis?.length ? (
          <Flex gap={12}>
            <Flex vertical flex={1}>
              <Checkbox
                indeterminate={
                  apiCheckedKeys.length > 0 && apiCheckedKeys.length < data?.apis?.length
                }
                onChange={onCheckAllChange}
                checked={apiCheckedKeys.length >= data?.apis?.length}
                style={{ marginBottom: '10px' }}
              >
                <span style={{ minWidth: 'max-content' }}>{t('api.case.select_all')}</span>
              </Checkbox>
              <Tree
                checkable
                onCheck={(checkedKeys: string[], e: any) => setApiCheckedKeys(checkedKeys, e)}
                checkedKeys={apiCheckedKeys}
                height={410}
                className="preview-tree"
                treeData={arrayToTreeObject(data?.apis)}
                defaultExpandAll
                selectable={false}
                fieldNames={{
                  title: 'name',
                  children: 'children',
                  key: 'target_id',
                  type: 'target_type',
                }}
              />
            </Flex>
            {importLocation === ImportLocationEnum.append && (
              <Flex
                style={{
                  width: '300px',
                  height: '450px',
                  padding: '12px',
                  background: 'var(--color-bg-page)',
                  borderRadius: '4px',
                }}
                className="import-project-append-config"
                gap={16}
                vertical
              >
                <Flex vertical gap={8}>
                  <span className="import-project-full-title">{t('supplement.select_folder')}</span>
                  <Form.Item noStyle name="chooseFolder">
                    <TreeSelect
                      popupClassName="import-project-full-select"
                      getPopupContainer={(triggerNode: HTMLElement) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      showSearch
                      filterTreeNode={(input, treeNode) => {
                        return treeNode?.name?.includes(input);
                      }}
                      treeDefaultExpandAll
                      placeholder={t('supplement.select_folder_tip')}
                      style={{ width: '100%' }}
                      fieldNames={{
                        label: 'name',
                        value: 'target_id',
                        children: 'children',
                      }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={apisFolders}
                    />
                  </Form.Item>
                </Flex>
              </Flex>
            )}
          </Flex>
        ) : (
          <Empty style={{ minHeight: 400 }} />
        );
      }
      if (key === ExportConfigEnum.model) {
        return data?.models?.length ? (
          <Flex gap={12}>
            <Flex vertical flex={1}>
              <Checkbox
                indeterminate={
                  modelCheckedKeys.length > 0 && modelCheckedKeys.length < data?.models?.length
                }
                onChange={onModelCheckAllChange}
                checked={modelCheckedKeys.length >= data?.models?.length}
                style={{ marginBottom: '10px' }}
              >
                <span style={{ minWidth: 'max-content' }}>{t('api.case.select_all')}</span>
              </Checkbox>
              <Tree
                checkable
                onCheck={(keys: string[], e: any) => setModelCheckedKeys(keys, e)}
                checkedKeys={modelCheckedKeys}
                height={460}
                className="preview-tree"
                treeData={arrayToTreeObject(data?.models, 'model_id')}
                defaultExpandAll
                selectable={false}
                titleRender={(nodeData: any) => {
                  return nodeData.title.props?.display_name || nodeData.title.props?.name;
                }}
                fieldNames={{
                  children: 'children',
                  key: 'model_id',
                  type: 'model_type',
                }}
              />
            </Flex>
            {importLocation === ImportLocationEnum.append && (
              <Flex
                style={{
                  width: '300px',
                  height: '450px',
                  padding: '12px',
                  background: 'var(--color-bg-page)',
                  borderRadius: '4px',
                }}
                className="import-project-append-config"
                gap={16}
                vertical
              >
                <span className="import-project-full-title">{t('supplement.overwrite_mode')}</span>
                <Form.Item noStyle name="model_cover_modal">
                  <Select
                    style={{ width: '100%' }}
                    placeholder={t('common.select_tip')}
                    options={SWAGGER_FULL_MODAL_OPTIONS}
                  />
                </Form.Item>
                <span className="import-project-full-tip">{t('supplement.same_model_name')}</span>
              </Flex>
            )}
          </Flex>
        ) : (
          <Empty style={{ minHeight: 400 }} />
        );
      }
      if (key === ExportConfigEnum.env) {
        return (
          <Flex gap={12}>
            <Flex vertical flex={1}>
              <Checkbox
                indeterminate={
                  previewSelectData.envs.length > 0 &&
                  previewSelectData.envs.length < data?.envs?.length
                }
                onChange={onEnvCheckAllChange}
                checked={previewSelectData.envs.length >= data?.envs?.length}
                style={{ marginBottom: '10px' }}
              >
                <span style={{ minWidth: 'max-content' }}>{t('api.case.select_all')}</span>
              </Checkbox>
              <BasicTable
                scroll={{ y: 500 }}
                showHeader={false}
                rowKey="env_id"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowSelection={{
                  selectedRowKeys: previewSelectData.envs,
                  onChange: rowSelectionChange,
                  renderCell(_, record: any, __, node: React.ReactNode) {
                    if (!record?.env_id) {
                      return null;
                    }
                    return node;
                  },
                }}
              />
            </Flex>

            {importLocation === ImportLocationEnum.append &&
              fileType === IMPORT_TYPE_ENUM.ECHOAPI && (
                <Flex
                  style={{
                    width: '300px',
                    height: '450px',
                    padding: '12px',
                    background: 'var(--color-bg-page)',
                    borderRadius: '4px',
                  }}
                  className="import-project-append-config"
                  gap={16}
                  vertical
                >
                  <span className="import-project-full-title">
                    {t('supplement.overwrite_mode')}
                  </span>
                  <Form.Item noStyle name="env_cover_modal">
                    <Select
                      style={{ width: '100%' }}
                      placeholder={t('common.select_tip')}
                      options={APIPOST_FULL_ENV_OPTIONS}
                    />
                  </Form.Item>
                </Flex>
              )}
          </Flex>
        );
      }
      return '';
    };

    const getLength = (key: ExportConfigEnum) => {
      if (key === ExportConfigEnum.request) {
        const apis = filter(
          data?.apis,
          (item: ApiDetailsData) =>
            ![APIS_TARGET_TYPE_ENUM.FOLDER, APIS_TARGET_TYPE_ENUM.SOCKET].includes(
              item?.target_type
            )
        );
        const selectApis = filter(
          data?.apis,
          (item: ApiDetailsData) =>
            ![APIS_TARGET_TYPE_ENUM.FOLDER, APIS_TARGET_TYPE_ENUM.SOCKET].includes(
              item?.target_type
            ) && previewSelectData.apis.includes(item?.target_id)
        );
        return apis?.length ? `${selectApis.length}/${apis.length}` : 0;
      }
      if (key === ExportConfigEnum.model) {
        const models = filter(
          data?.models,
          (item) => item?.model_type !== APIS_TARGET_TYPE_ENUM.FOLDER
        );
        const selectModels = filter(
          data?.models,
          (item) =>
            item?.model_type !== APIS_TARGET_TYPE_ENUM.FOLDER &&
            previewSelectData.models.includes(item?.model_id)
        );
        return models?.length ? `${selectModels.length}/${models.length}` : 0;
      }
      if (key === ExportConfigEnum.env) {
        const selectEnvs = previewSelectData.envs;
        return data?.envs?.length ? `${selectEnvs.length}/${data?.envs.length}` : 0;
      }
      return 0;
    };

    return EXPORT_PREVIEW_CONFIG_ITEMS.map(({ key, label }) => {
      return {
        label: (
          <Flex>
            <span>{label}</span>
            <span>({getLength(key)})</span>
          </Flex>
        ),
        key,
        children: children(key),
      };
    });
  }, [data, previewSelectData, apisFolders]);

  return (
    <PreviewContainer
      width="80%"
      destroyOnClose
      title={t('common.api_tab.preview')}
      onCancel={onCancel}
      styles={{
        body: {
          minHeight: 505,
        },
      }}
      footer={
        <Flex justify="space-between" align="center">
          <Typography.Text style={{ color: 'var(--font-light-color)' }}>
            {t('common.import_modal.import_tip')}
          </Typography.Text>
          <Button disabled={loading} onClick={() => onProjectImport()} type="primary">
            {t('settings.synchronize.import_now_tip_confirm')}
          </Button>
        </Flex>
      }
      open={open}
    >
      {loading ? <LoadingContainer spinning /> : <Tabs items={items} />}
    </PreviewContainer>
  );
};

export default Index;
