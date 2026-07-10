import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Input, Popconfirm } from 'antd';

import { snowflakeId } from 'apipost-tools';
import cn from 'classnames';
import { differenceWith, isArray, isEqual, isString, trim, unionWith } from 'lodash';

import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { useProjectSetting } from '@/store';

import ItemSettings from '../itemSettings';

import { ItemWrapper } from './style';

const lineHeight = 32;

interface Props {
  value: any;
  onChange: (key: string, val: any) => void;
  onDeleteNode: () => void;
  enableDelete: boolean;
  onManageChange: (attr: string, newVal: any) => void;
  singleOnly: boolean;
  nodeKey?: string;
  isRequired: boolean | undefined;
  onUpdateRequired: (required: boolean) => void;
}

const ItemMock: React.FC<Props> = (props) => {
  const {
    value,
    onChange,
    onDeleteNode,
    enableDelete,
    onManageChange,
    nodeKey,
    isRequired,
    onUpdateRequired,
  } = props;
  const { t } = useTranslation();
  const { projectId } = useParams();
  const [modalType, setModalType] = useState(null);
  const descriptionList = useProjectSetting((state) => state.descriptionList);
  const updateDescriptionList = useProjectSetting((state) => state.updateDescriptionList);
  const innerDescriptionList = useProjectSetting((state) => state.innerDescriptionList);

  const handleUpdateRequired = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onUpdateRequired(!isRequired);
  };
  const handlerInput = (e: any) => {
    const tar = e.target as HTMLTextAreaElement,
      scrollHeight = tar?.scrollHeight;

    if (scrollHeight <= lineHeight || tar.value.length === 0) {
      tar.style.height = lineHeight + 'px';
    } else {
      tar.style.height = scrollHeight + 'px';
    }
  };

  const handlerBlur = (e: any) => {
    const tar = e.target as HTMLTextAreaElement;
    tar.style.height = lineHeight + 'px';
    if (!nodeKey) return;

    if (!isString(value?.description) || trim(value?.description).length <= 0) return;

    if (!isArray(descriptionList)) return;

    // Filter out data that duplicates with custom description library
    const _descriptionList = unionWith(
      [
        {
          id: snowflakeId(),
          project_id: projectId || '',
          key: nodeKey,
          description: value?.description || '',
          no_save: 1,
        },
      ],
      descriptionList,
      (object, other) => isEqual([object.key, object.description], [other.key, other.description])
    );

    // Filter out data that duplicates with internal description library
    const uniqueListByInner = differenceWith(
      _descriptionList,
      innerDescriptionList,
      (obj1, obj2) => {
        return isEqual([obj1.key, obj1.description], [obj2.key, obj2.description]);
      }
    );

    updateDescriptionList(uniqueListByInner);
  };

  return (
    <div className={cn('schema-td', 'settings-td', 'table-td')}>
      {isString(modalType) && modalType !== 'null' && modalType !== '' && (
        <ItemSettings
          value={value}
          onChange={onManageChange}
          modalType={modalType}
          setModalType={setModalType}
        />
      )}
      <ItemWrapper className={cn('schema-td-warper')}>
        <div className="desc-row-description">
          <Input.TextArea
            autoSize={false}
            value={value?.description || ''}
            style={{ position: 'absolute', minHeight: 32, top: 0, height: 32, lineHeight: '26px' }}
            variant="borderless"
            size="small"
            onInput={handlerInput}
            onFocus={handlerInput}
            onBlur={handlerBlur}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder={t('common.schema.description')}
          />
        </div>
        <Flex gap={8} className="item-manage">
          <Tooltip title={t('common.schema.required')}>
            <div
              onClick={handleUpdateRequired}
              className={cn('item-required', { required: isRequired })}
            >
              <IconFont style={{ fontSize: 14 }} type="icon-fuhao" />
            </div>
          </Tooltip>
          <Popconfirm
            title={t('common.tips')}
            className="delete-item-icon"
            onConfirm={onDeleteNode}
          >
            <Button
              style={{ visibility: enableDelete ? 'visible' : 'hidden' }}
              icon={<IconFont type="icon-delete" />}
              size="small"
              type="text"
            ></Button>
          </Popconfirm>

        </Flex>
      </ItemWrapper>
    </div>
  );
};

export default memo(ItemMock);
