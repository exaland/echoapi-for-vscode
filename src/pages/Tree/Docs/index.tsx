import React, { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react'
import { Empty, IconFont } from '@/components/ui';
import { Button, Dropdown, Flex, GetProps, MenuProps, message, Skeleton, Tooltip, Tree, TreeProps, Typography } from 'antd';
import cn from 'classnames';
import { DocsContainer, ItemTitleContainer, TreeContainer } from './style';
import Search from '../components/Search';
import { useDebounceFn, useMemoizedFn, useSafeState } from 'ahooks';
import { TreeDataFilterParams } from '@/types/tree';
import { ApisItemActionType } from '@/types/apis/other';
import useDocsData from './hooks/useDocsData';
import useShare from '@/store/useShare';
import apisActionMap from '@/events/apis/action';
import TitleExtraContent from '../TitleExtraContent';
import { useApis, useGlobal, useUserConfig } from '@/store';
import { chunk, cloneDeep, concat, forEach, head, includes, isArray, isEmpty, isEqual, isPlainObject, last, map, reduce, toUpper } from 'lodash';
import { ApiDetailsData, TreeDataItem as ApiTreeDataItem } from '@/types/apis/api';
import ItemIcon from '../components/ItemIcon';
import ItemTitle from '../components/ItemTitle';
import SvgHttp from '@/assets/icon/http.svg?react';
import { formatTimeToDateTimeLong } from '@/utils/time';
import { useTranslation } from 'react-i18next';
import { DataNode } from 'antd/es/tree';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import useTreeSort from '@/hooks/useTreeSort';
import useTreeData from '@/hooks/useTreeData';
import { DEFAULT_CALC_CHILDREN_COUNT_TYPES, DESIGN_APIS_FOLDER_OPERATE_LIST, DESIGN_APIS_MORE_OPERATE_LIST, DROP_POSITION_ENUM, FOLDER_TYPE_INCLUDES, SOCKET_METHOD_FOLDER_OPERATE_LIST, SOCKET_SERVICE_FOLDER_OPERATE_LIST, SSE_METHOD_OPERATE_LIST } from '@/constants/tree';
import { createOpensItem } from '@/events/apis/opens';
import { getApisDetailsRequest, getApisListService } from '@/sevices/apis';
import { moveApisRequestType } from '@/types/apis/services';
import { SCHEMAS_MODEL_TYPE_ENUM } from '@/constants/schemas';
import { ApisBaseData } from '@/types/apis/base';

const customFieldNames:any = {
  title: 'name',
  key: 'target_id',
  parentKey: 'parent_id',
  children: 'children',
  type: 'target_type',
  parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
}

type TreeDataItem = ApiTreeDataItem & DataNode;

const { DirectoryTree } = Tree;

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const Docs = (props: {tabValue:string}) => {
  const {tabValue} = props;
  const { t } = useTranslation();
  const shareData = useShare((state) => state.shareData);

  const [treeHeight, setTreeHeight] = useSafeState(500);
  const [scrollIng, setScrollIng] = useSafeState(false);
  const [treeExpandedKeys, setTreeExpandedKeys] = useSafeState<string[]>([]);
  const currentProject = useUserConfig(store => store.currentProject);
  const updateTreeLoading = useApis(stroe => stroe.updateTreeLoading);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const updateDocsActiveKey = useApis((store) => store.updateDocsActiveKey);
  const docsActiveKey = useApis((store) => store.docsActiveKey);
  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
  const containerRef = useRef<any>(null);
  const treeRef = useRef<any>(null);
  const treeLoading = useApis(stroe => stroe.treeLoading);
  const token = useUserConfig(store => store.token)
  const [treeDataFilterParams, setTreeDataFilterParams] = useSafeState<TreeDataFilterParams>({
    value: '',
  });

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
  }, [containerRef?.current, tabValue]);

  const computedMoreOperateMenus = useMemoizedFn((nodeItem: ApisBaseData) => {
    const { target_type } = nodeItem;

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.FOLDER)) {
      return map(DESIGN_APIS_FOLDER_OPERATE_LIST, (it) => {
          return {
            ...it,
            icon: <IconFont type={it?.icon || ''} style={{ fontSize: 'var(--font-size-16)' }} />,
        }
      });
    }
    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SOCKET)) {
      return map(SOCKET_SERVICE_FOLDER_OPERATE_LIST, (item) => ({
        ...item,
        icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
      }));
    }
    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SOCKET_METHOD)) {
      return map(SOCKET_METHOD_FOLDER_OPERATE_LIST, (item) => ({
        ...item,
        icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
      }));
    }

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SSE)) {
      return map(SSE_METHOD_OPERATE_LIST, (item) => ({
        ...item,
        icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
      }));
    }

    return map(DESIGN_APIS_MORE_OPERATE_LIST, (item) => ({
      ...item,
      icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
    }));
  });

  const nodeItemDropdownContextMenu = useCallback((nodeItem: ApiDetailsData): MenuProps => {
    return {
      items: computedMoreOperateMenus(nodeItem),
      onClick: ({ keyPath, domEvent }) => handleMoreOperateClick(nodeItem, keyPath, domEvent),
    };
  }, []);

  const findPositionExpandKeys = (originKey: string) => {
    const result: string[] = [];
    const handle = (key: string) => {
      const target = apiOriginDetailsList.find(i=>i?.target_id === key);
      if (target?.target_id) {
        result.unshift(target?.target_id);
      }
      if (target?.parent_id) {
        handle(target?.parent_id);
      }
    };

    handle(originKey);

    return result;
  };

  const onPosition = () => {
    const targetId = `${docsActiveKey}`;
    const keys = findPositionExpandKeys(targetId);

    setTreeExpandedKeys(concat([], treeExpandedKeys, keys));
    setTimeout(() => {
      treeRef?.current?.scrollTo({ apisActiveKey: docsActiveKey, align: 'auto' });
    }, 300);
  };

  const onExpendedAll = (isExpanded: boolean)=>{

    if (isExpanded) {
      setTreeExpandedKeys([]);
      return;
    }

    const _keys: string[] = [];

    forEach(apiOriginDetailsList, (item) => {
      if (
        includes(
          [
            APIS_TARGET_TYPE_ENUM.FOLDER,
            APIS_TARGET_TYPE_ENUM.SOCKET,
            SCHEMAS_MODEL_TYPE_ENUM.MODEL,
          ],
          item.target_type
        )
      ) {
        _keys.push(item.target_id);
      }
    });

    setTreeExpandedKeys(_keys);
  };
 

  const onHistoryClick = () => {
    // Open history share list tab
    window?.vscode.postMessage({
      action: 'openeShareListPanel',
    });
  }

  const { treeData } = useTreeData({
    searchIncludesField: ['name', 'url'],
    treeDataFilterParams,
    dataSource: apiOriginDetailsList as any,
    customFieldNames,
    typeIncludes: [APIS_TARGET_TYPE_ENUM.FOLDER, APIS_TARGET_TYPE_ENUM.API],
    folderIncludes: [...FOLDER_TYPE_INCLUDES],
    expandedKeys:treeExpandedKeys,
    setExpandedKeys:setTreeExpandedKeys,
  });

  async function handlePull() {
    // If not logged in, open login page
    if (!token) {
      // Open login tab
      window?.vscode.postMessage({
        action: 'openLogin',
      });
    }

    // Local project prompt
    if (!currentProject?.project_id || currentProject?.project_id === '-1' || !token) {
      message.error(
        <>
          <p style={{ textAlign: 'left' }}> {t('common.please')}:</p>
          <p style={{ textAlign: 'left' }}> 1. {t('own.sign_cloud_account')}</p>
          <p style={{ textAlign: 'left' }}> 2. {t('own.switch_team_project')}</p>
          <p style={{ textAlign: 'left' }}> {t('own.pull_tip')}</p>
        </>
      );
      return;
    }

    // Loading state
    updateTreeLoading(true);

    // Fetch project data
    const res = await getApisListService({ project_id: currentProject.project_id });
    if (isArray(res?.list) && res.list.length > 0) {
      const newApiList = cloneDeep(apiOriginDetailsList);
      const chunk_list = chunk(res.list, 100);

      const replaceIds: string[] = [];

      for (let index = 0; index < chunk_list.length; index++) {
        const chunk = chunk_list[index];
        const chunk_ids = chunk.reduce((pre: any, cur) => {
          if (cur?.target_id && ['api', 'sse', 'folder'].includes(cur?.target_type)) {
            pre.push(cur.target_id);
          }
          return pre;
        }, []);
        const apiRes = await getApisDetailsRequest({
          project_id: currentProject.project_id,
          target_ids: chunk_ids
        });
        if (isArray(apiRes?.list) && apiRes.list.length > 0) {
          forEach(apiRes.list, (target) => {
            const index = newApiList.findIndex((i: any) => i?.target_id === target?.target_id);
            if (index > -1) {
              newApiList[index] = target;
              // Record IDs of replaced local data (update share time)
              replaceIds.push(target.target_id);
            } else {
              newApiList.push(target);
            }
          });
        }
      }

      updateApiOriginDetailsList(newApiList);

      // Save data to local cloud project list
      window?.vscode.postMessage({
        action: 'setApiList',
        data: newApiList
      });

      if (replaceIds.length > 0) {
        // Update share time for local records with share history
        window?.vscode.postMessage({
          action: 'updateShareTime',
          data: replaceIds
        });
      }

    }
    // Loading state
    updateTreeLoading(false);

  }

  const createApi = async () => {
    const result = await createOpensItem({
      target_type: APIS_TARGET_TYPE_ENUM.API,
      project_id: '',
      parent_id: '0'
    });
    window?.vscode.postMessage({
      action: 'openTagPanel',
      data: result
    });
  };

  const onSelect: DirectoryTreeProps['onSelect'] = (keys) => {
    const curKey = head(keys) as string;
    // Update the currently selected tab key
    updateDocsActiveKey(curKey);
    window?.vscode.postMessage({
      action: 'openDesignPanelById',
      data: curKey
    });
  };

  const onExpand: TreeProps['onExpand'] = useMemoizedFn((keys, { nativeEvent }) => {
    // NOTE: Disable auto-expand when dragging into
    if (isEqual(nativeEvent.type, 'dragenter')) { return; }
    setTreeExpandedKeys(keys as string[]);
  });

  const switcherIcon = useMemo(
    () => <IconFont type="icon-drop-down" style={{ fontSize: 16 }} />,
    []
  );

  const { run: stopScrollIng } = useDebounceFn(
    () => {
      setScrollIng(false);
    },
    { wait: 100 }
  );

  const handleScroll = useMemoizedFn(() => {
    setScrollIng(true);
    stopScrollIng();
  });

  const titleRender = useMemoizedFn((item: TreeDataItem) => {
    return React.cloneElement(item.title as any, {
      scrollIng,
    });
  });

  const calcChildrenCountFunc = useMemoizedFn((children: ApiTreeDataItem['children']) => {
    const includesTypes = DEFAULT_CALC_CHILDREN_COUNT_TYPES;

    function count(children: ApiTreeDataItem['children']) {
      return reduce(
        children,
        (acc, item) => {
          if (!includes(includesTypes, item[customFieldNames.type])) {
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

  const nodeItemTitleExtraContent = useMemoizedFn((nodeItem: any) => (
    <TitleExtraContent
      nodeItem={nodeItem}
    />
  ));

  const computedTreeData = useMemoizedFn((data: TreeDataItem[]): TreeDataItem[] => {
    return map(data, (item) => {
      let icon: React.ReactNode = '';
      const isParentNodeType = isEqual(item[customFieldNames.type], customFieldNames.parentNodeType);

  
      let method,urlInfo;
      if(isPlainObject(item?.open_api) && !isEmpty(item?.open_api)){
        let firstKey = Object.keys(item?.open_api)[0];
        urlInfo = item?.open_api[firstKey];
      }
      if(isPlainObject(urlInfo) && !isEmpty(urlInfo)){
        method = Object.keys(urlInfo)[0];
      }
      if (!isParentNodeType) {
        icon = <ItemIcon {...item} {...(customFieldNames as Record<string, string>)} {...(method ? {method:toUpper(method)} : {})}/>;
      }

      const selectable = !isParentNodeType;

      const extendProps = {};

      const childrenCount = calcChildrenCountFunc(item.children);


      const baseProps = {
        key: item[customFieldNames.key as keyof TreeDataItem] as string,
        isLeaf: item.isLeaf,
        selectable,
        style: { height: 28 },
        icon,
        title: (
          <ItemTitle
            {...item}
            {...extendProps}
            fieldType={customFieldNames.type}
            childrenCount={childrenCount}
            name={item[customFieldNames.title as keyof TreeDataItem] as string}
            showChildrenCount={true}
            nodeItemTitleExtraContent={nodeItemTitleExtraContent}
            nodeItemDropdownContextMenu={nodeItemDropdownContextMenu}
          />
        ),
      };

      if (item[customFieldNames.children as keyof TreeDataItem]) {
        return {
          ...baseProps,
          children: computedTreeData(item[customFieldNames.children as string] as TreeDataItem[]),
        };
      }

      return { ...baseProps };
    }) as TreeDataItem[];
  });

  const defaultBottomNode = useMemo(
    () => (
      <div className='tree-bottom-node-empty' style={{height:100}}></div>
    ),
    [t]
  );

  const renderTreeData = useMemoizedFn((data: TreeDataItem[]): TreeDataItem[] => {
    const result = computedTreeData(data);

    if (defaultBottomNode) {
      result.push({
        className: 'tree-bottom-node-wrap',
        title: defaultBottomNode,
        key: 'tree-bottom-node-key',
        isLeaf: true,
        icon: <div />,
        selectable: false,
      } as TreeDataItem);
    }


    return result;
  });

  // NOTE: Can internal computedTreeData get the latest data?
  const finalTreeData = useMemo(() => {
    return renderTreeData(treeData);
  }, [treeData, renderTreeData]);

  // Tree sort allow drop configuration
  const allowDrop: TreeProps['allowDrop'] = (info) => {
    const { dropNode, dropPosition, dragNode } = info;

    const dragNodeTitleProps = (dragNode?.title as ReactElement)?.props || {};
    const dropNodeTitleProps = (dropNode?.title as ReactElement)?.props || {};

    // Types that do not allow dragging inside
    if (
      includes(
        [
          APIS_TARGET_TYPE_ENUM.API,
          APIS_TARGET_TYPE_ENUM.DOC,
          APIS_TARGET_TYPE_ENUM.GRPC,
          APIS_TARGET_TYPE_ENUM.WEBSOCKET,
          APIS_TARGET_TYPE_ENUM.SOCKET_METHOD,
          APIS_TARGET_TYPE_ENUM.SSE,
          APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
          APIS_TARGET_TYPE_ENUM.SOCKETIO,
          APIS_TARGET_TYPE_ENUM.GRAPHQL
        ],
        dropNodeTitleProps?.target_type
      ) &&
      isEqual(dropPosition, DROP_POSITION_ENUM.INSIDE)
    ) {
      return false;
    }

    // Special handling for TCP methods, only allow sorting within current TCP client
    if (isEqual(APIS_TARGET_TYPE_ENUM.SOCKET, dropNodeTitleProps?.target_type)) {
      if (
        isEqual(dropPosition, DROP_POSITION_ENUM.INSIDE) &&
        !isEqual(APIS_TARGET_TYPE_ENUM.SOCKET_METHOD, dragNodeTitleProps?.target_type)
      ) {
        return false;
      }
      if (
        isEqual(APIS_TARGET_TYPE_ENUM.SOCKET_METHOD, dragNodeTitleProps?.target_type) &&
        !isEqual(dragNodeTitleProps?.parent_id, dropNodeTitleProps?.target_id)
      ) {
        return false;
      }
    }

    if (isEqual(APIS_TARGET_TYPE_ENUM.SOCKET_METHOD, dropNodeTitleProps?.target_type)) {
      if (!isEqual(APIS_TARGET_TYPE_ENUM.SOCKET_METHOD, dragNodeTitleProps?.target_type)) {
        return false;
      }
      if (!isEqual(dropNodeTitleProps?.parent_id, dragNodeTitleProps?.parent_id)) {
        return false;
      }
    }

    if (
      isEqual(APIS_TARGET_TYPE_ENUM.SOCKET_METHOD, dragNodeTitleProps?.target_type) &&
      !includes(
        [APIS_TARGET_TYPE_ENUM.SOCKET, APIS_TARGET_TYPE_ENUM.SOCKET_METHOD],
        dropNodeTitleProps?.target_type
      )
    ) {
      return false;
    }

    return true;
  };

  // Data processing after move
  const handleMoveApis = async (data: moveApisRequestType) => {
    try {
      window?.vscode.postMessage({
        action: 'onDrop',
        data
      });
    } catch (err) {
      // message.error(`${err}`);
    }
  };

  const { genNewData, ...originTreeSortProps } = useTreeSort({
    allowDrop,
    primaryIdKeyName: 'target_id',
    onMoveApis: handleMoveApis,
    type:'target_type'
  });

  return (
    <DocsContainer>
      <Search
        treeDataFilterParams={treeDataFilterParams}
        setTreeDataFilterParams={setTreeDataFilterParams}
        showActions={true}
        type='design'
        onPosition={onPosition} 
        onHistoryClick={onHistoryClick}
        onExpandAll={onExpendedAll} 
        apisActiveKey={docsActiveKey} />

      <Skeleton active paragraph={{ rows: 15, width: '100%' }} loading={treeLoading}>
        <div className="tree-wrap">
          <TreeContainer ref={containerRef}>
            {treeData.length <= 0 ? <Empty
              className="response-empty-wrap"
              description={<Flex gap={6} justify='center' align='center' vertical>
                <Flex wrap='wrap'>Guess you haven't created any requests yet!</Flex>
                <Flex justify='center' align='center' wrap='wrap'>
                  <Flex gap={4} align='center'>You can {currentProject?.project_id !== '-1' && <Button style={{ height: '24' }} type='text' onClick={handlePull}>Pull cloud data</Button>}&nbsp; </Flex>
                  <Flex gap={4} align='center'>{currentProject?.project_id !== '-1' && 'or'} <Button style={{ height: '24' }} type='text' onClick={createApi}>Create a new request</Button></Flex>
                </Flex>
              </Flex>}
              image={<IconFont type="icon-zanwu" className="icon-empty-wrap" />}
            /> : <DirectoryTree
              ref={treeRef}
              height={treeHeight}
              onSelect={onSelect}
              selectedKeys={[docsActiveKey]}
              onExpand={onExpand}
              expandedKeys={treeExpandedKeys}
              expandAction='click'
              onScroll={handleScroll}
              switcherIcon={switcherIcon}
              titleRender={titleRender}
              treeData={finalTreeData}
              {...originTreeSortProps}
            />}
          </TreeContainer>
        </div>
      </Skeleton>
    </DocsContainer>

  );
};

export default Docs;
