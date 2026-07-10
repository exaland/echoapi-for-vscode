import { memo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useTranslation } from 'react-i18next';

import { Flex, Popconfirm, Switch } from 'antd';

import { useDeepCompareEffect, useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { isEmpty, map, throttle } from 'lodash';
import VirtualList from 'rc-virtual-list';

import OrderNumber from '@/components/business/SortableCollapse/OrderNumber';
import Collapse from '@/components/ui/Collapse';
import IconFont from '@/components/ui/IconFont';
import { STATUS_CODE } from '@/constants/common';
import useTheme from '@/hooks/useTheme';

import Arrow from './Arrow';
import Tag from './Tag';
import { AnyObject, DRAG_MODE, SortableCollapseProps, SortableItemProps } from './types';
import { getDefaultActiveKey } from './utils';

import { SortableCollapseWrapper } from './style';

const SortableItem = <SortItem extends AnyObject>({
  isTree,
  orderNumber,
  rowKey,
  sortItem,
  ...restProps
}: SortableItemProps<SortItem>) => {
  const { t } = useTranslation();
  const {
    sortable = true,
    showOrderNumber = true,
    showTag = true,
    defaultTools = {},
    notChildren = [],
    hoverShowTools = true,
    isDefaultActiveKeyShowAll = false,
    isDefaultActiveItems = [],
    customHoverTools,
    customTools,
    customHeader,
    customContent,
    onCollapseChange,
    handleDragEnd,
  } = restProps;

  const refHandler = useRef(null);
  const refContainer = useRef(null);

  const { themeToken } = useTheme();

  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [dragMode, setDragMode] = useState<DRAG_MODE | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const showArrow = !notChildren.includes(sortItem.type);

  useDeepCompareEffect(() => {
    const defaultActiveKey = getDefaultActiveKey({
      isDefaultActiveKeyShowAll,
      isDefaultActiveItems,
      type: sortItem.type,
    });
    setActiveKey(defaultActiveKey);
  }, [isDefaultActiveItems, isDefaultActiveKeyShowAll]);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'card',
    item: () => {
      return { index: sortItem[rowKey], nodeKey: sortItem[rowKey] };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'card',
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    hover: throttle((_, monitor) => {
      if (!refHandler?.current) {
        return;
      }

      const hoverBoundingRect = (refHandler.current as HTMLElement)?.getBoundingClientRect();
      const hoverHeight = hoverBoundingRect?.bottom - hoverBoundingRect?.top;
      const clientOffset = monitor.getClientOffset();

      let mode = null;
      if (clientOffset === null || hoverBoundingRect === null) {
        return;
      }

      if (clientOffset.y < hoverBoundingRect.y + hoverHeight / 3) {
        mode = DRAG_MODE.TOP;
      } else if (
        clientOffset.y >= hoverBoundingRect.y + hoverHeight / 3 &&
        clientOffset.y < hoverBoundingRect.y + hoverHeight * (2 / 3)
      ) {
        mode = DRAG_MODE.INSIDE;
      } else {
        mode = DRAG_MODE.BOTTOM;
      }

      setDragMode(mode);
    }, 50),
    drop(item: any, monitor) {
      const didDrop = monitor.didDrop();
      if (!didDrop && dragMode) {
        handleDragEnd && handleDragEnd(item.nodeKey, sortItem[rowKey], dragMode);
      }
    },
  });

  drag(refHandler);
  drop(refContainer);

  const renderHeader = useMemoizedFn(() => {
    return (
      <div
        className="header-container"
        ref={preview}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flex align="center" gap={12}>
          {showOrderNumber && orderNumber && <OrderNumber orderNumber={orderNumber} />}
          {defaultTools.onSwitchChange && (
            <Switch
              size="small"
              checked={sortItem[defaultTools.switchKey || 'enabled'] === STATUS_CODE.ENABLE}
              onChange={(checked, event) => {
                event.stopPropagation();
                defaultTools.onSwitchChange?.(checked, sortItem);
              }}
            />
          )}
          {showTag && <Tag type={sortItem.type} />}
          {<Arrow show={showArrow} activeKey={activeKey} />}
          {customHeader && (
            <div
              className={classNames('custom-header', {
                ['hover-show-custom-header']: hoverShowTools,
              })}
            >
              {customHeader(sortItem)}
            </div>
          )}
        </Flex>
      </div>
    );
  });

  const renderChildren = useMemoizedFn(() => {
    return (
      <div className="children-container">
        {map(sortItem.children, (children, idx: number) => {
          return (
            <SortableItem
              isTree={isTree}
              sortable={sortable}
              rowKey={rowKey}
              key={children[rowKey]}
              orderNumber={idx + 1}
              sortItem={children}
              handleDragEnd={handleDragEnd}
              {...restProps}
            />
          );
        })}
        {customContent && customContent(sortItem)}
      </div>
    );
  });

  const renderExtra = useMemoizedFn(() => {
    return (
      <Flex
        align="center"
        gap={12}
        className="extra-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flex gap={themeToken.padding12} style={{ opacity: hoverShowTools && isHovered ? 1 : 0 }}>
          {customHoverTools && customHoverTools(sortItem)}
          {!isEmpty(defaultTools) && (
            <Flex gap={themeToken.padding12}>
              {defaultTools.onDelete && (
                <Popconfirm
                  title={t('common.tips')}
                  onConfirm={() => {
                    defaultTools.onDelete?.(sortItem);
                  }}
                >
                  <IconFont style={{ color: themeToken.iconColor }} type="icon-delete" />
                </Popconfirm>
              )}
            </Flex>
          )}
        </Flex>
        {customTools && customTools(sortItem)}
      </Flex>
    );
  });

  const items = [
    {
      key: sortItem.orderNumber,
      label: renderHeader(),
      children: renderChildren(),
      extra: renderExtra(),
    },
  ];

  const onChange = useMemoizedFn((activeKey: string | string[]) => {
    setActiveKey(activeKey[0]);
    onCollapseChange?.(activeKey[0], sortItem);
  });

  const top = isOver && dragMode === DRAG_MODE.TOP;
  const inside = isTree && isOver && canDrop && dragMode === DRAG_MODE.INSIDE;
  const bottom = isOver && dragMode === DRAG_MODE.BOTTOM;

  return (
    <div
      ref={refContainer}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={classNames('item-container', {
        top,
        inside,
        bottom,
      })}
    >
      {sortable && (
        <div ref={refHandler} className="icon">
          <IconFont
            type="icon-drag"
            style={{ color: themeToken.iconColor, fontSize: themeToken.fontSize }}
          />
        </div>
      )}
      <div style={{ width: `calc(100% - ${sortable ? '20' : '0'}px)` }}>
        <Collapse
          headerPadding="4px 12px"
          activeKey={activeKey}
          bordered
          items={items as any}
          collapsible={showArrow ? 'header' : 'icon'}
          onChange={(activeKey) => onChange(activeKey)}
        />
      </div>
    </div>
  );
};

const PureSortableItem = memo(SortableItem) as typeof SortableItem;

const SortableCollapse = <SortItem extends AnyObject>({
  isVirtualList = false,
  containerRef,
  isTree,
  rowKey,
  sortable = true,
  sortItemList,
  handleDragEnd,
  wrapClassName,
  ...restProps
}: SortableCollapseProps<SortItem>) => {
  if (isVirtualList) {
    return (
      <VirtualList
        data={sortItemList}
        height={containerRef?.current?.clientHeight}
        itemHeight={54}
        itemKey={rowKey}
      >
        {(sortItem: SortItem, index) => (
          <SortableCollapseWrapper key={sortItem[rowKey]} className={classNames(wrapClassName)}>
            <PureSortableItem
              isTree={isTree}
              handleDragEnd={handleDragEnd}
              sortable={sortable}
              rowKey={rowKey}
              key={sortItem[rowKey]}
              orderNumber={index + 1}
              sortItem={sortItem}
              {...restProps}
            />
          </SortableCollapseWrapper>
        )}
      </VirtualList>
    );
  }

  return (
    <SortableCollapseWrapper className={classNames(wrapClassName)}>
      {map(sortItemList, (sortItem, index) => (
        <PureSortableItem
          isTree={isTree}
          handleDragEnd={handleDragEnd}
          sortable={sortable}
          rowKey={rowKey}
          key={sortItem[rowKey]}
          orderNumber={index + 1}
          sortItem={sortItem}
          {...restProps}
        />
      ))}
    </SortableCollapseWrapper>
  );
};

export default SortableCollapse;
