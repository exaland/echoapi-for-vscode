import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { TreeProps } from 'antd';
import { DataNode } from 'antd/es/tree';

import produce from 'immer';
import { assign, concat, forEach, includes, isEqual, last } from 'lodash';

import { DEFAULT_NO_DRAG_INCLUDES_KEYS, DROP_POSITION_ENUM } from '../constants';

interface Props {
  allowDrop?: TreeProps['allowDrop'];
  nodeDraggableKeys?: string[];
  onMoveApis?: (data: any) => void;
  primaryIdKeyName: string;
}

const useTreeSort = (props: Props) => {
  const { primaryIdKeyName, allowDrop, nodeDraggableKeys = [], onMoveApis } = props;

  const { projectId } = useParams();

  const nodeDraggable = (node: DataNode) => {
    return !includes(concat([], DEFAULT_NO_DRAG_INCLUDES_KEYS, nodeDraggableKeys), node.key);
  };

  const genNewData = <
    T extends Record<string, any>,
    U extends Record<typeof primaryIdKeyName, any>,
  >(
    detailsData: { [x: string]: T },
    list: U[]
  ) => {
    return produce(detailsData, (draft) => {
      forEach(list, (item) => {
        const key = item[primaryIdKeyName];

        if (draft[key]) {
          draft[key] = {
            ...draft[key],
            ...(item as unknown as T),
          };
        }
      });
    });
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = String(info.node.key);
    const dragKey = String(info.dragNode.key);

    const dropTitleProps = (info.node.title as ReactElement)?.props;
    const dropParentId = dropTitleProps?.parent_id;

    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(last(dropPos));

    const positionTargetId = {
      [`after_${primaryIdKeyName}`]: '0',
      [`before_${primaryIdKeyName}`]: '0',
    };

    const moveParams = {
      project_id: String(projectId),
      parent_id: dropParentId,
      [`${primaryIdKeyName}s`]: [dragKey],
    };

    if (isEqual(dropPosition, DROP_POSITION_ENUM.TOP)) {
      positionTargetId[`after_${primaryIdKeyName}`] = dropKey;
    }
    if (isEqual(dropPosition, DROP_POSITION_ENUM.BOTTOM)) {
      positionTargetId[`before_${primaryIdKeyName}`] = dropKey;
    }
    if (isEqual(dropPosition, DROP_POSITION_ENUM.INSIDE)) {
      moveParams.parent_id = dropKey;
    }

    onMoveApis?.(assign({}, moveParams, positionTargetId));
  };

  return {
    allowDrop,
    draggable: { icon: false, nodeDraggable: nodeDraggable },
    onDrop,
    genNewData,
  };
};

export default useTreeSort;
