import React, { memo, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input } from 'antd';

import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useMemoizedFn, useSafeState } from 'ahooks';
import cn from 'classnames';
import classNames from 'classnames';
import produce from 'immer';
import { isObject, isString, isUndefined } from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';

import { IconFont, Tooltip } from '@/components/ui';
import Button from '@/components/ui/Button';
import { useProjectSetting, useUserConfig } from '@/store';

import schemaContext from '../../context';
import SplitBar from '../SplitBar';
import ItemSettings from '../itemSettings';

import { BthsPanelDiv, KeyWarperContainer } from './style';

export interface ItemKeyProps {
  nodeType: string;
  nodeKey: string;
  deepIndex: number;
  onNodeKeyChange: (oldKey: string, newKey: string) => void;
  readOnly: boolean;
  expand: boolean;
  setExpand: (val: boolean) => void;
  onChange: (attr: string, newVal: any) => void;
  isRequired: boolean | undefined;
  onUpdateRequired: (required: boolean) => void;
  txtKeyRef: React.LegacyRef<HTMLInputElement> | any;
  minWidth?: number;
  sortAble?: boolean;
  value?: any;
  onManageChange?: any;
  DragHandle?: any;
  isModelItem?: boolean;
  descChange?: any;
  onAddSiblingNode: () => void;
  onAddNode: () => void;
  singleOnly: boolean;
  mockDisable: boolean;
  mockValue: string;
  overrideData?: any;
  onChangeMock: (key: string, newVal: any) => void;
}

const ItemKey: React.FC<ItemKeyProps> = (props) => {
  const {
    nodeType,
    nodeKey,
    deepIndex,
    onNodeKeyChange = () => undefined,
    readOnly,
    expand,
    setExpand,
    onChange = () => undefined,
    isRequired = false,
    onUpdateRequired = () => void 0,
    txtKeyRef,
    minWidth = 250,
    sortAble,
    value,
    onManageChange,
    DragHandle,
    isModelItem,
    descChange,
    onAddSiblingNode,
    onAddNode,
    singleOnly = false,
    mockDisable,
    mockValue,
    overrideData,
    onChangeMock,
  } = props;
  const { t } = useTranslation();
  const { refTable, layouts, setLayouts } = useContext(schemaContext);
  const descriptionList = useProjectSetting((state) => state.descriptionList);
  const innerDescriptionList = useProjectSetting((state) => state.innerDescriptionList);
  const currentProject = useUserConfig((state) => state.currentProject);

  const tdWidth = layouts?.[0]?.width ?? 400;
  const refContainerWarper: any = useRef(null);

  const showArrow = ['object', 'array', 'oneOf', 'anyOf', 'allOf'].includes(nodeType);

  const handleUpdateWidth = useMemoizedFn((newWidth) => {
    const newLayouts = produce(layouts, (draft: any) => {
      draft[0].width = newWidth;
      draft[0].flex = 'unset';
    });
    setLayouts(newLayouts);
  });

  useEffect(() => {
    if (deepIndex !== 0) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (tdWidth < width) {
          handleUpdateWidth(width);
        }
      }
    });
    resizeObserver.observe(refContainerWarper?.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [tdWidth]);

  const [nodeTitle, setNodeTitle] = useSafeState(nodeKey);
  useEffect(() => {
    setNodeTitle(nodeKey);
  }, [nodeKey]);

  const handleChangeKey: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onNodeKeyChange(nodeKey, e.target.value);
    setNodeTitle(e.target.value);
  };

  const handleSortMouseDown = () => {
    setExpand(false);
  };

  const isShowAddBtn =
    ['object', 'oneOf', 'allOf', 'anyOf'].includes(nodeType) ||
    (nodeType === 'array' && isUndefined(value?.items));

  const showSiblingAdd =
    ['string', 'number', 'boolean', 'integer', 'null'].includes(nodeType) &&
    !singleOnly &&
    !isShowAddBtn;

  const handleBlurKey = (e: any) => {
    if (!isModelItem && !value?.description && descChange) {
      const list =
        currentProject.is_describe_library === 1
          ? [...descriptionList, ...innerDescriptionList]
          : descriptionList;
      const desc = list.find((i) => i.key === e.target.value)?.description || '';
      if (desc) {
        descChange('description', desc);
      }
    }
  };
  const IndentPanel = (deepIndex: any) => {
    // Generate indent array based on deepIndex
    const indents = Array.from({ length: deepIndex - 1 }, (_, index) => (
      <div key={index} className="indent-panel"></div>
    ));

    return indents;
  };

  return (
    <div
      ref={refContainerWarper}
      className={cn('schema-td', 'table-td')}
    >
      <KeyWarperContainer className={cn('schema-td-warper', 'schema-width-auto')}>
        {IndentPanel(deepIndex)}
        {deepIndex > 0 && sortAble && (
          <div style={{ position: 'absolute', zIndex: 999 }}>{DragHandle(handleSortMouseDown)}</div>
        )}
        {deepIndex > 0 && (
          <div className="empty-btn">
            <div className="empty-btn-l"></div>
            <div className="empty-btn-r"></div>
          </div>
        )}
        {showArrow && (
          <Button
            type="text"
            className="caret-icon"
            icon={expand ? <CaretDownOutlined /> : <CaretRightOutlined />}
            size="small"
            onClick={setExpand.bind(null, !expand)}
          ></Button>
        )}
        {readOnly && (
          <Button
            size="small"
            className={`item-key-input apipost-btn-disabled readonly ${
              deepIndex === 0 && 'item-key-input-front'
            }`}
            spellCheck={false}
            style={{
              flex: 1,
              outline: 'none',
              boxShadow: 'none',
            }}
          >{`${deepIndex === 0 ? t('common.schema.root') : nodeTitle}`}</Button>
        )}
        {!readOnly && (
          <Flex style={{ position: 'relative', height: '100%' }}>
            <div className="hidden-input">{`${
              deepIndex === 0 ? t('common.schema.root') : nodeTitle
            }`}</div>
            <Input
              size="small"
              ref={txtKeyRef}
              className={`item-key-input item-key-input-hover ${
                deepIndex === 0 && 'item-key-input-front'
              }`}
              spellCheck={false}
              style={{
                flex: 1,
                outline: 'none',
                boxShadow: 'none',
              }}
              readOnly={readOnly}
              placeholder={t('common.schema.field_name')}
              value={`${deepIndex === 0 ? t('common.schema.root') : nodeTitle}`}
              onChange={handleChangeKey}
              onBlur={handleBlurKey}
            />
          </Flex>
        )}

        <ItemSettings
          renderChild={
            <Flex
              align="center"
              style={{
                margin: '0 8px',
                position: 'relative',
                zIndex: isObject(overrideData) ? 1000 : 0,
              }}
              className={classNames(nodeType, 'item-key-types')}
            >
              {nodeType}
            </Flex>
          }
          isRequired={isRequired}
          empty={value?.apipiost_allow_null === true}
          handleUpdateRequired={(isRequired: boolean) => onUpdateRequired(!isRequired)}
          handleChangeAllowNull={() => onChange('apipiost_allow_null', !value?.apipiost_allow_null)}
          handleChangeType={(value: string) => onChange('type', value)}
          showSettings={isString(nodeType) && nodeType !== ''}
          value={value}
          onChange={onManageChange}
          modalType={nodeType}
          mockDisable={mockDisable}
          mockValue={mockValue}
          overrideData={overrideData}
          onChangeMock={onChangeMock}
        />

        {deepIndex === 0 && (
          <SplitBar
            minWidth={minWidth}
            refTable={refTable}
            key={layouts?.[0]?.width}
            width={layouts?.[0]?.width}
            onUpdateWidth={handleUpdateWidth}
          />
        )}
        <BthsPanelDiv>
            {isShowAddBtn && (
            <Tooltip title={t('common.schema.add_child_node')}>
              <Button
                icon={<IconFont type="icon-circle-add" style={{ color: 'var(--color-success)' }} />}
                size="small"
                type="text"
                onClick={onAddNode}
              ></Button>
            </Tooltip>
          )}
          {showSiblingAdd && (
            <Tooltip title={t('common.schema.add_adjacent_node')}>
              <Button
                icon={<IconFont type="icon-circle-add" style={{ color: 'var(--color-success)' }} />}
                size="small"
                type="text"
                onClick={onAddSiblingNode}
              ></Button>
            </Tooltip>
          )}
        </BthsPanelDiv>
      </KeyWarperContainer>
    </div>
  );
};

export default memo(ItemKey);
