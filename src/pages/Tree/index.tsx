import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import { Button, Flex, message, Skeleton, Tooltip, Tree, Typography } from 'antd';
import type { GetProps, MenuItemProps, MenuProps, TreeProps } from 'antd';
import { TreeMenuContainer, CreateOtherIcon, TreeContainer } from './style';
import Search from './components/Search';
import { API_TYPE_INCLUDES, APIS_FOLDER_OPERATE_LIST, APIS_MORE_OPERATE_LIST, DROP_POSITION_ENUM, FOLDER_TYPE_INCLUDES, SOCKET_METHOD_FOLDER_OPERATE_LIST, SOCKET_SERVICE_FOLDER_OPERATE_LIST, SOCKETIO_METHOD_OPERATE_LIST, SSE_METHOD_OPERATE_LIST, TREE_CREATE_LIST, WEBSOCKET2_METHOD_OPERATE_LIST } from '@/constants/tree';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { useDebounceFn, useMemoizedFn, useSafeState } from 'ahooks';
import { getApisDetailsRequest, getApisListService } from '@/sevices/apis';
import apisActionMap from '@/events/apis/action';
import { TreeDataFilterParams } from '@/types/tree';
import { chunk, cloneDeep, concat, forEach, head, includes, isArray, isEqual, isPlainObject, last, map, omit, reduce } from 'lodash';
import IconFont from '@/components/ui/IconFont';
import { createOpensItem } from '@/events/apis/opens';
import useTreeData from '@/hooks/useTreeData';
import ItemIcon from './components/ItemIcon';
import ItemTitle from './components/ItemTitle';

import { TreeDataItem as ApiTreeDataItem } from '@/types/apis/api';
import { DataNode } from 'antd/es/tree';
import { DEFAULT_CALC_CHILDREN_COUNT_TYPES } from './constants';
import { ApisBaseData } from '@/types/apis/base';
import ApisColorPrefixIcon from '@/components/ui/ApisColorPrefixIcon';
import { ApisItemActionType } from '@/types/apis/other';
import { moveApisRequestType } from '@/types/apis/services';
import useTreeSort from '@/hooks/useTreeSort';

import TitleExtraContent from './TitleExtraContent';
import { useTranslation } from 'react-i18next';
import { useApis, useProjectConfig, useUserConfig } from '@/store';
import TreeMenuHeader from './components/TreeMenuHeader';
import { Empty } from '@/components/ui';
import { SegmentedTabs } from '@/components/business';
import NewBtns from './components/New';
import Tests from './Tests';
import Docs from './Docs';
import { openUrl } from '@/utils/open';
import { SCHEMAS_MODEL_TYPE_ENUM } from '@/constants/schemas';
import { VSCODE_VERSION } from '@/constants/vscode';
import { getEnvListService, getProjectGlobalParamService, getProjectGlobalVarService, getServiceList } from '@/sevices/project';

type TreeDataItem = ApiTreeDataItem & DataNode;

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

export interface TreeMenuProps {
  value: any[];
  createMenus?: MenuProps['items'];
  searchInputPlaceholder?: string;
}

const customFieldNames = {
  title: 'name',
  key: 'target_id',
  parentKey: 'parent_id',
  children: 'children',
  type: 'target_type',
  parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
};

const TreeAdd: React.FC<TreeMenuProps> = ({ value, searchInputPlaceholder }) => {
  const { t } = useTranslation();

  const treeRef = useRef<any>(null);

  const updateTreeLoading = useApis(stroe => stroe.updateTreeLoading);

  const [treeDataFilterParams, setTreeDataFilterParams] = useSafeState<TreeDataFilterParams>({
    value: '',
  });
  const [improveShow, setImproveShow] = useSafeState(true);
  const [treeExpandedKeys, setTreeExpandedKeys] = useSafeState<string[]>([]);
  const [tabValue, setTabValue] = useSafeState<string>('requests');
  const [scrollIng, setScrollIng] = useSafeState(false);
  const [treeHeight, setTreeHeight] = useSafeState(500);
  const containerRef = useRef<any>(null);
  const treeLoading = useApis(stroe => stroe.treeLoading);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const apisActiveKey = useApis(stroe => stroe.apisActiveKey);
  const token = useUserConfig(store => store.token)
  const updateApisActiveKey = useApis(stroe => stroe.updateApisActiveKey);

  useEffect(() => {
    if (tabValue === 'tests') {
      // Fetch the latest report data
      window?.vscode.postMessage({
        action: 'getProjectReportList',
      });
    };
  }, [tabValue]);

  const updateApiOriginDetailsList = useApis((store) => store.updateApiOriginDetailsList);
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

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {

    const curKey = head(keys) as string;
    // Update the currently selected tab key
    updateApisActiveKey(curKey);
    window?.vscode.postMessage({
      action: 'openTagPanelById',
      data: curKey
    });
  };

  const onExpand: TreeProps['onExpand'] = useMemoizedFn((keys, { nativeEvent }) => {
    // NOTE: Disable auto-expand when dragging into
    if (isEqual(nativeEvent.type, 'dragenter')) { return; }
    setTreeExpandedKeys(keys as string[]);
  });

  const handleCreateItemClick: MenuItemProps['onClick'] = async ({ key }) => {
    if (key === 'folder') {
      window?.vscode.postMessage({
        action: 'showInputBox',
      });
      return;
    }
    if (key === 'import_curl') {
      window?.vscode.postMessage({
        action: 'openCurlPanel',
      });
      return;
    }
    if (key === 'import_data') {
      window?.vscode.postMessage({
        action: 'openImportDataPanel',
        data: { type: 'curl' }
      });
      return;
    }

    if (key === 'import_tc_data') {
      window?.vscode.postMessage({
        action: 'openImportDataPanel',
        data: { type: 'thunderClient' }
      });
      return;
    }

    if(key === 'export_data'){
      window?.vscode.postMessage({
        action: 'openExportDataPanel',
        data: { type: 'echoapi' }
      });
      return;
    }

    const result = await createOpensItem({
      target_type: key as APIS_TARGET_TYPE_ENUM,
      project_id: '',
      parent_id: '0'
    });


    window?.vscode.postMessage({
      action: 'openTagPanel',
      data: result
    });

  };

  const createMenus: MenuProps['items'] = map(TREE_CREATE_LIST, (item) => ({
    ...omit(item, ['gradientColor']),
    key: item.key as string,
    label: item.label,
    icon: item.gradientColor ? (
      <ApisColorPrefixIcon icon={item.icon || ''} gradientColor={item.gradientColor} />
    ) : (
      <CreateOtherIcon>
        <IconFont type={item.icon || ''} />
      </CreateOtherIcon>
    ),
    onClick: handleCreateItemClick,
  }));

  const { treeData } = useTreeData({
    searchIncludesField: ['name', 'url'],
    treeDataFilterParams,
    dataSource: value,
    customFieldNames,
    typeIncludes: [...API_TYPE_INCLUDES],
    folderIncludes: [...FOLDER_TYPE_INCLUDES],
    expandedKeys:treeExpandedKeys,
    setExpandedKeys:setTreeExpandedKeys,
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
  const computedMoreOperateMenus = useMemoizedFn((nodeItem: ApisBaseData) => {
    const { target_type } = nodeItem;

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.FOLDER)) {
      return map(APIS_FOLDER_OPERATE_LIST, (it) => {
        if (it?.children) {
          return {
            ...it,
            icon: <IconFont type={it.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
            children: map(it?.children, (child: { gradientColor: string[]; icon: string }) => ({
              ...child,
              icon: child.gradientColor ? (
                <ApisColorPrefixIcon icon={child.icon || ''} gradientColor={child.gradientColor} />
              ) : (
                <CreateOtherIcon>
                  <IconFont type={child.icon || ''} />
                </CreateOtherIcon>
              ),
            })),
          };
        } else {
          return {
            ...it,
            icon: <IconFont type={it.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
          };
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

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.WEBSOCKET2)) {
      return map(WEBSOCKET2_METHOD_OPERATE_LIST, (item) => ({
        ...item,
        icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
      }));
    }

    if (isEqual(target_type, APIS_TARGET_TYPE_ENUM.SOCKETIO)) {
      return map(SOCKETIO_METHOD_OPERATE_LIST, (item) => ({
        ...item,
        icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
      }));
    }

    return map(APIS_MORE_OPERATE_LIST, (item) => ({
      ...item,
      icon: <IconFont type={item.icon} style={{ fontSize: 'var(--font-size-16)' }} />,
    }));
  });
  const handleMoreOperateClick = useMemoizedFn(
    async (
      nodeItem: ApisBaseData,
      keyPath: string[],
      domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
    ) => {
      domEvent.stopPropagation();

      const targetType = nodeItem?.target_type;
      const actionType = last(keyPath) || '';

      const currentAction = (apisActionMap as any)[targetType];
      const actionFun = currentAction[actionType];

      const nodeDetails = value.find((i: any) => i?.target_id === nodeItem.target_id);
      const actionFunParams: ApisItemActionType = {
        apisData: nodeDetails,
        projectId: '',
      };

      // For folder type, need to pass in child node type
      if (isEqual(targetType, APIS_TARGET_TYPE_ENUM.FOLDER)) {
        actionFunParams.childTargetType = head(keyPath) as APIS_TARGET_TYPE_ENUM;
      }

      actionFun?.(actionFunParams);
    }
  );
  const nodeItemDropdownContextMenu = useMemoizedFn((nodeItem: ApisBaseData): MenuProps => {
    return {
      items: computedMoreOperateMenus(nodeItem),
      onClick: ({ keyPath, domEvent }) => handleMoreOperateClick(nodeItem, keyPath, domEvent),
    };
  });

  const computedTreeData = useMemoizedFn((data: TreeDataItem[]): TreeDataItem[] => {
    return map(data, (item) => {
      let icon: React.ReactNode = '';
      const isParentNodeType = isEqual(item[customFieldNames.type], customFieldNames.parentNodeType);

      if (!isParentNodeType) {
        icon = <ItemIcon {...item} {...(customFieldNames as Record<string, string>)} />;
      }

      const selectable = !isParentNodeType;

      const extendProps: any = {};

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
      <div className='tree-bottom-node-empty' style={{ height: 100 }}></div>
    ),
    [createMenus, t]
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

  const titleRender = useMemoizedFn((item: TreeDataItem) => {
    return React.cloneElement(item.title as any, {
      scrollIng,
    });
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
  // Data processing after move
  const handleMoveApis = async (data: moveApisRequestType) => {
    try {
      window?.vscode.postMessage({
        action: 'onDrop',
        data
      });
    } catch (err) {
    }
  };
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
  const { genNewData, ...originTreeSortProps } = useTreeSort({
    allowDrop,
    primaryIdKeyName: 'target_id',
    onMoveApis: handleMoveApis,
    type: 'target_type',
  });

  const currentProject = useUserConfig(store => store.currentProject);
  const { envList, globalVars, serverList } = useProjectConfig(store => store);

  async function handlePull() {
    try {
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
            if (cur?.target_id && ['api', 'sse', 'folder', 'websocket2', 'socketio','graphql'].includes(cur?.target_type)) {
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
              // Add VS Code version number
              target.vscode_version = VSCODE_VERSION;
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

      // Fetch environment info
      if (currentProject?.project_id !== '-1') {
        const project_config: any = {
          serverList: serverList
        };
        // Fetch cloud service list
        const serviceList = await getServiceList({ project_id: currentProject?.project_id })
        if (isArray(serviceList) && serviceList.length > 0) {
          const newServerList = cloneDeep(serverList)
          // Merge local services
          forEach(serviceList, (i) => {
            let localServiceIndex = newServerList.findIndex(f => f?.server_id == i?.server_id);
            if (localServiceIndex > -1) {
              newServerList[localServiceIndex] = i;
            } else {
              newServerList.push(i);
            }
          });
          project_config.serverList = newServerList;
        }
        // Fetch project config info
        const envRes = await getEnvListService({ project_id: currentProject?.project_id });
        if (isArray(envRes) && envRes.length > 0) {
          const localEnvList = cloneDeep(envList);
          // Merge local environments
          forEach(envRes, (i) => {
            let localItemIndex = localEnvList.findIndex(a => a?.env_id === i?.env_id);
            if (localItemIndex > -1) {
              // Correct service list under environment
              i.server_list = project_config.serverList.map((s: any) => {
                if (isArray(i?.server_list)) {
                  let cloudServer = i.server_list.find((a: any) => a?.server_id == s?.server_id);
                  // Cloud service exists
                  if (cloudServer != undefined) {
                    return cloudServer;
                  }
                }

                let localServer = localEnvList[localItemIndex].server_list.find((a: any) => a?.server_id == s?.server_id);

                if (localServer != undefined) {
                  // Local service exists
                  return localServer;
                }
                return s;
              });
               // Merge environment variables
               i.env_var_list = {
                ...localEnvList[localItemIndex]?.env_var_list || {},
                ...i?.env_var_list || {},
              };
              localEnvList[localItemIndex] = i;
            } else {
              // Correct service list under environment
              i.server_list = project_config.serverList.map((s: any) => {
                if (isArray(i?.server_list)) {
                  let cloudServer = i.server_list.find((a: any) => a?.server_id == s?.server_id);
                  if (cloudServer != undefined) {
                    return cloudServer;
                  }
                }
                return s;
              });
              localEnvList.push(i);
            }
          });
          project_config.envList = localEnvList;
        }
        const globalVar = await getProjectGlobalVarService({ project_id: currentProject?.project_id });
        if (isPlainObject(globalVar?.global_var_list)) {
          // Merge local vars
          project_config.globalVars = {
            ...globalVars,
            ...globalVar.global_var_list
          };
        }

        const globalParam = await getProjectGlobalParamService({ project_id: currentProject?.project_id });
        if (isPlainObject(globalParam?.global_param)) {
          // Merge local globalParams
          project_config.globalParams = globalParam.global_param;
        }

        window?.vscode.postMessage({
          action: 'setProjectConfig',
          data: project_config
        });
      }

    } catch (error) {}
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

  const onExpandAll = (isExpanded: boolean) => {

    if (isExpanded) {
      setTreeExpandedKeys([]);
      return;
    }

    const _keys: string[] = [];

    forEach(value, (item) => {
      if (
        includes(
          [
            APIS_TARGET_TYPE_ENUM.FOLDER,
            APIS_TARGET_TYPE_ENUM.SOCKET,
            SCHEMAS_MODEL_TYPE_ENUM.MODEL,
          ],
          item[(customFieldNames as any)?.type]
        )
      ) {
        _keys.push(item[(customFieldNames as any)?.key]);
      }
    });

    setTreeExpandedKeys(_keys);
  };

  const findPositionExpandKeys = (originKey: string) => {
    const result: string[] = [];
    const handle = (key: string) => {
      const target = value.find(i => i?.target_id === key);
      if (target?.[(customFieldNames as any)?.key]) {
        result.unshift(target?.[(customFieldNames as any)?.key]);
      }
      if (target?.parent_id) {
        handle(target?.parent_id);
      }
    };

    handle(originKey);

    return result;
  };

  const onPosition = (key: string) => {
    const targetId = `${key}`;
    const keys = findPositionExpandKeys(targetId);

    setTreeExpandedKeys(concat([], treeExpandedKeys, keys));
    setTimeout(() => {
      treeRef?.current?.scrollTo({ key, align: 'auto' });
    }, 300);
  };


  const TESTING_CONFIG_TAB_LIST = [
    {
      label: <Flex justify='center' align='center' gap={4}>
        {t('common.api_tab.design')}
      </Flex>,
      value: 'docs',
      children: <Docs tabValue={tabValue} />,
    },
    {
      label: t('common.api_tab.run'),
      value: 'requests',
      children: <>
        <Search
          treeDataFilterParams={treeDataFilterParams}
          setTreeDataFilterParams={setTreeDataFilterParams}
          searchInputPlaceholder={searchInputPlaceholder}
          onPosition={onPosition}
          onExpandAll={onExpandAll}
          apisActiveKey={apisActiveKey}
          showActions={true}
        />
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
                selectedKeys={[apisActiveKey]}
                onExpand={onExpand}
                expandedKeys={treeExpandedKeys}
                expandAction={'click'}
                onScroll={handleScroll}
                switcherIcon={switcherIcon}
                titleRender={titleRender}
                treeData={finalTreeData}
                {...originTreeSortProps}
              />}
            </TreeContainer>
          </div>
        </Skeleton>
      </>,
    },
    {
      label: <Flex justify='center' align='center' gap={4}>
        {t('menu.test')}
        <Typography.Text style={{ padding: '0 2px', background: 'var(--color-primary-opacity)', color: 'var(--color-primary)', borderRadius: '2px', fontSize: '10px' }}>
          {t('common.no_limit')}
        </Typography.Text>
      </Flex>,
      value: 'tests',
      children: <Tests />
    },
  ];

  return (
    <>
      <TreeMenuContainer>
        <TreeMenuHeader handlePull={handlePull} />

        <NewBtns createMenus={createMenus} />

        <SegmentedTabs
          className="tab-container"
          options={TESTING_CONFIG_TAB_LIST}
          value={tabValue}
          onChange={(val) => {
            setTabValue(val as string);
          }}
        />
        {improveShow && <Tooltip title={'Help Us Improve EchoAPI'}>
          <div onClick={() => {
            openUrl('https://docs.google.com/forms/d/e/1FAIpQLSd_xkxxnKgfh0GCMLXzHcKHcqT1cow2xXBXxGmqA-Z7GDyKkw/viewform?usp=sf_link');
          }} className='help-us-improve-echoapi'>
            <IconFont type='icon-edit2' style={{color:'var(--color-primary)',fontSize:'20px'}} />
            <IconFont onClick={(e) => {
              e.stopPropagation();
              setImproveShow(false);
            }} className='icon-client-close' type='icon-client-close'></IconFont>
          </div>
        </Tooltip>}

      </TreeMenuContainer>

    </>

  );
};

export default TreeAdd;