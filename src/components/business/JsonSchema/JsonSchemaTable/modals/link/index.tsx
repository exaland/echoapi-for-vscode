import React, { memo, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Input, Tree } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import { isPlainObject, isUndefined } from 'lodash';

import Button from '@/components/ui/Button';
import Empty from '@/components/ui/Empty';
import IconFont from '@/components/ui/IconFont';
import Modal from '@/components/ui/Modal';

import context from '../../context';
import { listToTree } from '../../utils/list2tree';
import useListData from './hooks/useListData';

import { Footer, LinkWarper } from './style';

type Props = {
  open?: boolean;
  onLinkSchema: (modelInfo: any) => void;
  default_model_id?: string;
};

const LinkPanel: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { open, onLinkSchema, default_model_id } = props;

  const [value, setValue] = useSafeState<any | null>(null);
  const [expandedKeys, setExpandedKeys] = useSafeState<string[]>([]);
  const [filterName, setFilterName] = useSafeState<string>('');

  const { schemaData, getModelItem, model_id }: any = useContext(context);

  useEffect(() => {
    const defaultValue = schemaData?.[default_model_id!];
    if (isPlainObject(defaultValue)) {
      setValue(defaultValue);
    }
  }, [schemaData, default_model_id]);

  const menuList: any[] = useMemo(() => {
    return Object.values(schemaData || {});
  }, [schemaData]);
  const { filteredTreeList } = useListData({ menuList, filterName });

  const treeData = listToTree(filteredTreeList);

  const handleConfirm = async () => {
    onLinkSchema(value);
  };

  const handleClose = () => {
    onLinkSchema(null);
  };

  const onNodeClick = useMemoizedFn(async (key: string) => {
    const nodeData = getModelItem(key);
    if (!isPlainObject(nodeData)) {
      return;
    }
    if (nodeData.model_type !== 'model') {
      return;
    }
    if (nodeData?.model_id === value?.model_id) {
      setValue(null);
    } else {
      setValue(nodeData);
    }
  });

  const renderNode = (item: any) => {
    return (
      <div
        onClick={() => {
          if (item.model_type === 'folder' || item.key === model_id) return;
          onNodeClick(item.key);
        }}
        className="model-node-item"
      >
        <div className="icon-panel">
          {item.model_type === 'model' && (
            <>
              <Checkbox
                value={item.key}
                onClick={() => {
                  onNodeClick(item.key);
                }}
                checked={!isUndefined(value?.model_id) && item.key === value?.model_id}
                disabled={item.key === model_id}
              />
              <IconFont className="icon-model" type="icon-data-model" />
            </>
          )}
        </div>
        <span className="node-text ">
          {item.model_type === 'folder' && (
            <IconFont
              style={{ marginRight: 5 }}
              type={expandedKeys?.includes(item?.key) ? 'icon-open-folder' : 'icon-folder'}
            />
          )}
          {item?.title}
        </span>
      </div>
    );
  };

  return (
    <Modal
      width={600}
      style={{ height: 410 }}
      title={t('imp_models.title')}
      open={open}
      onCancel={handleClose}
      footer={
        filteredTreeList.length === 0
          ? null
          : [
              <Footer>
                <Button type="primary" onClick={handleConfirm}>
                  {t('imp_models.confirm')}
                </Button>
              </Footer>,
            ]
      }
    >
      <LinkWarper>
        <Input
          value={filterName}
          onChange={(e) => {
            setFilterName(e.target.value);
          }}
          prefix={<IconFont type="icon-search-line" />}
          placeholder={t('imp_models.search_tip')}
        />

        {filteredTreeList.length === 0 ? (
          <div className="empty-list">
            <Empty />
          </div>
        ) : (
          <Tree
            virtual
            height={360}
            showIcon={false}
            treeData={treeData}
            blockNode
            expandedKeys={expandedKeys}
            onExpand={(expandedKeys: any) => setExpandedKeys(expandedKeys)}
            className="tree-panel"
            titleRender={renderNode}
          ></Tree>
        )}
      </LinkWarper>
    </Modal>
  );
};

export default memo(LinkPanel);
