import { FC } from 'react';

import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cn from 'classnames';
import { includes, map } from 'lodash';

import { IconFont } from '@/components/ui';

import { DraggableMenuProps, GroupProps, ItemProps } from './types';

import {
  DraggableMenuContainer,
  DraggableMenuGroupContainer,
  DraggableMenuItemContainer,
} from './style';

const Item: FC<ItemProps> = ({
  id,
  children,
  icon,
  disableDraggable,
  selectedKeys,
  onItemClick,
}) => {
  const { setNodeRef, listeners, transform, transition, attributes, setActivatorNodeRef } =
    useSortable({ id: `${id}` });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <DraggableMenuItemContainer ref={setNodeRef} style={style} {...attributes}>
      <div
        className={cn('draggable-menu-item', {
          'draggable-menu-item-selected': includes(selectedKeys, id),
        })}
        onClick={() => onItemClick?.(`${id}`)}
      >
        {!disableDraggable && (
          <IconFont
            type="icon-drag"
            className="icon-drag"
            ref={setActivatorNodeRef}
            style={{ touchAction: 'none', cursor: 'move', fontSize: 10 }}
            {...listeners}
          />
        )}
        <span className="draggable-menu-item-icon">{icon}</span>
        <div className="draggable-menu-title-content">{children}</div>
      </div>
    </DraggableMenuItemContainer>
  );
};

const Group: FC<GroupProps> = ({ title, children }) => {
  return (
    <DraggableMenuGroupContainer>
      <div className="draggable-menu-item-group-title">{title}</div>
      <ul className="draggable-menu-item-group-list">{children}</ul>
    </DraggableMenuGroupContainer>
  );
};

const DraggableMenu: FC<DraggableMenuProps> = ({
  className,
  style,
  items,
  onDragEnd,
  selectedKeys,
  onSelect,
}) => {
  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  return (
    <DraggableMenuContainer className={className} style={style}>
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        {map(items, (menuItem) =>
          menuItem?.type === 'group' ? (
            <Group key={menuItem.key} title={menuItem.label}>
              <SortableContext
                items={map(menuItem.children, (i) => `${i?.key}`)}
                strategy={verticalListSortingStrategy}
                disabled={menuItem.disableDraggable}
              >
                {map(menuItem.children, (child) => (
                  <Item
                    key={`${child?.key}`}
                    id={`${child?.key}`}
                    icon={child?.icon}
                    disableDraggable={menuItem?.disableDraggable}
                    selectedKeys={selectedKeys}
                    onItemClick={(id) => onSelect?.([id])}
                  >
                    {child?.label}
                  </Item>
                ))}
              </SortableContext>
            </Group>
          ) : (
            <SortableContext
              items={map(items, (i) => `${i?.key}`)}
              strategy={verticalListSortingStrategy}
            >
              <Item
                key={menuItem.key}
                id={menuItem.key}
                icon={menuItem.icon}
                selectedKeys={selectedKeys}
                onItemClick={(id) => onSelect?.([id])}
              >
                {menuItem.label}
              </Item>
            </SortableContext>
          )
        )}
      </DndContext>
    </DraggableMenuContainer>
  );
};

export default DraggableMenu;
