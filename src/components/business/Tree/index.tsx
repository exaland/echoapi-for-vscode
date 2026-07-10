import React, { Ref, forwardRef, memo, useEffect, useMemo, useRef } from 'react';

import { Tree as AntdTree, Dropdown, MenuProps } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';

import { useDebounceFn, useMemoizedFn, useSafeState } from 'ahooks';
import { includes, isEqual, isFunction, map, reduce } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import { TreeDataItem as ApiTreeDataItem } from '@/types/apis/api';

import ItemIcon from './components/ItemIcon';
import ItemTitle from './components/ItemTitle';
import { DEFAULT_CALC_CHILDREN_COUNT_TYPES } from './constants';

import { TreeContainer } from './style';

const { DirectoryTree } = AntdTree;

type TreeDataItem = ApiTreeDataItem & DataNode;

export type Props = TreeProps & {
  treeData: any[];
  topNode?: React.ReactNode;
  bottomNode?: React.ReactNode;
  useOriginIcon?: boolean;
  forceSelectable?: boolean;
  fieldNames?: { [key: string]: any };
  parentNodeTypeSelectable?: boolean;
  showChildrenCount?: boolean;
  rootDropdownContextMenu?: MenuProps;
  notCalcChildrenCountTypes?: string[];
  nodeItemTitleExtraContent?: (item: any) => React.ReactNode;
  nodeItemDropdownContextMenu?: (item: any) => MenuProps;
  genTreeDataItemsExtendProps?: (item: any) => { [key: string]: any };
};

const Tree = forwardRef((props: Props, treeRef: Ref<any>) => {
  const {
    treeData,
    topNode,
    bottomNode,
    fieldNames,
    useOriginIcon,
    parentNodeTypeSelectable,
    forceSelectable = false,
    showChildrenCount = true,
    rootDropdownContextMenu,
    notCalcChildrenCountTypes,
    nodeItemTitleExtraContent,
    nodeItemDropdownContextMenu,
    genTreeDataItemsExtendProps,
    ...resetProps
  } = props;

  const {
    title = 'name',
    key = 'target_id',
    children = 'children',
    type = 'target_type',
    parentNodeType = 'folder',
  } = fieldNames || {};

  const [treeHeight, setTreeHeight] = useSafeState(500);
  const [scrollIng, setScrollIng] = useSafeState(false);

  const containerRef = useRef<any>(null);

  const { run: stopScrollIng } = useDebounceFn(
    () => {
      setScrollIng(false);
    },
    { wait: 100 }
  );

  const switcherIcon = useMemo(
    () => <IconFont type="icon-drop-down" style={{ fontSize: 16 }} />,
    []
  );

  useEffect(() => {
    const resizeHandler = () => {
      const containerHeight = containerRef?.current?.offsetHeight;
      setTreeHeight(containerHeight);
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const calcChildrenCountFunc = useMemoizedFn((children: ApiTreeDataItem['children']) => {
    const includesTypes = notCalcChildrenCountTypes || DEFAULT_CALC_CHILDREN_COUNT_TYPES;

    function count(children: ApiTreeDataItem['children']) {
      return reduce(
        children,
        (acc, item) => {
          if (!includes(includesTypes, item[type])) {
            acc += 1;
          }

          if (item.children && item.children.length > 0) {
            acc += count(item.children);
          }

          return acc;
        },
        0
      );
    }

    return count(children);
  });

  const computedTreeData = useMemoizedFn((data: TreeDataItem[]): TreeDataItem[] => {
    return map(data, (item) => {
      let icon: React.ReactNode = '';
      const isParentNodeType = isEqual(item[type], parentNodeType);

      if (useOriginIcon) {
        icon = isFunction(resetProps?.icon) ? resetProps?.icon(item as any) : resetProps?.icon;
      } else {
        if (!isParentNodeType) {
          icon = <ItemIcon {...item} {...(fieldNames as Record<string, string>)} />;
        }
      }

      const selectable = !forceSelectable && (!parentNodeTypeSelectable || !isParentNodeType);

      const extendProps = genTreeDataItemsExtendProps?.(item) || {};

      const childrenCount = calcChildrenCountFunc(item.children);

      const baseProps = {
        key: item[key as keyof TreeDataItem] as string,
        isLeaf: item.isLeaf,
        selectable,
        style: { height: 30 },
        icon,
        title: (
          <ItemTitle
            {...item}
            {...extendProps}
            fieldType={type}
            childrenCount={childrenCount}
            name={item[title as keyof TreeDataItem] as string}
            showChildrenCount={showChildrenCount}
            nodeItemTitleExtraContent={nodeItemTitleExtraContent}
            nodeItemDropdownContextMenu={nodeItemDropdownContextMenu}
          />
        ),
      };

      if (item[children as keyof TreeDataItem]) {
        return {
          ...baseProps,
          children: computedTreeData(item[children as string] as TreeDataItem[]),
        };
      }

      return { ...baseProps };
    }) as TreeDataItem[];
  });

  const renderTreeData = useMemoizedFn((data: TreeDataItem[]): TreeDataItem[] => {
    const result = computedTreeData(data);

    if (topNode) {
      result.unshift({
        key: 'tree-top-node-key',
        className: 'tree-top-node-wrap',
        title: topNode,
        isLeaf: true,
        icon: <div />,
        selectable: false,
      } as TreeDataItem);
    }

    if (bottomNode) {
      result.push({
        className: 'tree-bottom-node-wrap',
        title: bottomNode,
        key: 'tree-bottom-node-key',
        isLeaf: true,
        icon: <div />,
        selectable: false,
      } as TreeDataItem);
    }

    return result;
  });

  // NOTE can internal computedTreeData get the latest data?
  const finalTreeData = useMemo(() => {
    return renderTreeData(treeData);
  }, [treeData, renderTreeData]);

  const handleScroll = useMemoizedFn(() => {
    setScrollIng(true);
    stopScrollIng();
  });

  const titleRender = useMemoizedFn((item: TreeDataItem) => {
    return React.cloneElement(item.title as any, {
      scrollIng,
    });
  });

  return (
    <TreeContainer ref={containerRef}>
      <DirectoryTree
        ref={treeRef}
        height={treeHeight}
        treeData={finalTreeData}
        onScroll={handleScroll}
        switcherIcon={switcherIcon}
        titleRender={titleRender}
        {...resetProps}
      />
      {rootDropdownContextMenu && <Dropdown
        trigger={['contextMenu']}
        disabled={!rootDropdownContextMenu}
        menu={rootDropdownContextMenu}
      >
        <div className="root-context-menu-holder-placeholder" />
      </Dropdown>}
    </TreeContainer>
  );
});

const MemoTree = memo(Tree);

export default MemoTree;
