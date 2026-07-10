import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Spin, TreeProps, message } from 'antd';

import { useDebounceFn, useDeepCompareEffect, useMemoizedFn, useMount } from 'ahooks';
import { ASTNode, Kind, parse, print } from 'graphql';
import { produce } from 'immer';
import {
  add,
  assign,
  cloneDeep,
  concat,
  difference,
  filter,
  findIndex,
  forEach,
  get,
  has,
  includes,
  isArray,
  isEmpty,
  isEqual,
  map,
  mergeWith,
  size,
  some,
  startsWith,
  union,
  unionBy,
} from 'lodash';

import GraphQLQueryContext from '@/components/business/GraphQLQuery/context/GraphQLQueryContext';
import GraphQLSchemaProvider from '@/components/business/GraphQLQuery/context/GraphQLSchemaProvider';
import MonacoEditor from '@/components/business/MonacoEditor';
import { Button, Empty, IconFont } from '@/components/ui';
import { useApis } from '@/store';
import { ApiDetailsData } from '@/types/apis/api';
import { FilterDataType } from '@/types/apis/graphql';
import { GraphQLRequestBody, GraphQLRequestBodyQueryItem } from '@/types/apis/request';
import { AnyObject } from '@/types/common';
import { graphql2json } from '@/utils/graphql/graphql2json';
import { createArguments, createOperationDefinition } from '@/utils/graphql/json2graphql';
import { raw2tree, transformStructure } from '@/utils/graphql/schema2tree';

import ResizablePanels from '../ResizablePanels';
import SuspenseContent from '../SuspenseContent';
import SchemaTree from './components/SchemaTree';
import useGraphQLQuery from './hooks';

import { MainContainer } from './style';

const panelProps = {
  defaultSize: 50,
  minSize: 5,
  collapsible: true,
  collapsedSize: 5,
};

interface Props {
  data: GraphQLRequestBody;
  onChange: (value: GraphQLRequestBody, search_id?: string) => void;
}

const Main = forwardRef((props: Props, ref) => {
  const { t } = useTranslation();
  const { data, onChange } = props;
  const { apiData } = useContext(GraphQLQueryContext);

  const currentServerId = useApis((state) => state.currentServerId);
  const schemaLoading  = useApis((state) => state?.schemaLoading);
  const updateSchemaLoading  = useApis((state) => state.updateSchemaLoading);
  
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [filterData, setFilterData] = useState<FilterDataType>({});
  const [treeData, setTreeData] = useState<any>([]);

  const monacoEditorGraphqlRef = useRef<any>();
  const monacoEditorJsonRef = useRef<any>();
  const variablesPanelRef = useRef<any>();
  const searchData =
    data.query_list.find((e) => isEqual(e.param_id, apiData.search_id)) ||
    data.query_list?.[0] ||
    {};

  useImperativeHandle(ref, () => ({
    resetRawLayout: (layout: any) => {
      variablesPanelRef?.current?.setPanelGroupLayout(layout);
    },
  }));

  useMount(() => {
    if (!searchData.query) return;
    rawToTree(searchData.query);
  });

  useEffect(() => {
    if (apiData?.search_id) {
      rawToTree(searchData.query);
    }
  }, [apiData?.search_id]);

  useDeepCompareEffect(() => {
    try {
      const { tree }: any = raw2tree(data.query_schema || {});
      setTreeData([tree.Query]);
      rawToTree(searchData.query);
    } catch (err) {
      setTreeData([]);
    }
  }, [data.query_schema]);

  const getKeys = (arr: any[], prefix: string = '') => {
    return arr.reduce(
      (pre, item) => {
        if (!item.children) {
          pre.keys.push(`${prefix ? `${prefix}.` : ''}${item.name}`);
        } else {
          const { keys, filterData } = getKeys(
            item.children,
            `${prefix ? `${prefix}.` : ''}${item.name}`
          );
          pre.keys = concat(pre.keys, keys);
          pre.filterData = assign(pre.filterData, filterData);
        }
        if (item.arguments) {
          pre.filterData[`${prefix ? `${prefix}.` : ''}${item.name}`] = item.arguments;
        }
        return pre;
      },
      {
        keys: [],
        filterData: {},
      }
    );
  };

  const getNewKeys = (keys: string[]) => {
    const list = keys?.reduce(
      (pre, k) => {
        if (includes(k, '.')) {
          const res = getPartialStrings(k);
          pre = union(pre.concat(res));
        }
        return pre;
      },
      [...keys]
    );
    const keySet = new Set(list);
    let highestLevel = 1;
    forEach(list, (str) => {
      const level = str.split('.').length;
      // The split array length is one more than the number of dots (including empty string or the first part), so this is the correct level
      if (level > highestLevel) {
        highestLevel = level;
      }
    });
    const filterChildrenKeys = (children: any, level = 0) => {
      const deepLevel = add(level, 1);
      return children.reduce((acc: any, child: any) => {
        const key = child.key;
        if (keySet.has(key) && level <= highestLevel) {
          acc.push(key);
          if (child.children || has(graphqlObjects, child?.itemKind)) {
            const newChildren = size(child.children)
              ? child.children
              : map(graphqlObjects?.[child?.itemKind]?.children, (e) => ({
                ...e,
                key: `${child.key}.${e?.name}`,
                path: `${child.key}.${e?.name}`,
                ...(has(graphqlObjects, e?.itemKind) ? { children: [] } : { isLeaf: true }),
              }));
            const keys = filterChildrenKeys(newChildren, deepLevel);
            acc = concat(acc, keys);
          }
        }
        return acc;
      }, []);
    };
    const checkedKeys = filterChildrenKeys(treeData[0]?.children);
    return {
      checkedKeys: size(checkedKeys) ? union(concat(['Query'], checkedKeys)) : checkedKeys,
    };
  };

  const { run: rawToTree } = useDebounceFn(
    (value) => {
      try {
        const data = graphql2json(value);
        const { keys, filterData } = getKeys([data]);
        const { checkedKeys } = getNewKeys(keys);
        setCheckedKeys(checkedKeys);
        setFilterData(filterData);
      } catch (err) {
        setCheckedKeys([]);
        setFilterData({});
      }
    },
    { wait: 200 }
  );

  const filterGraphQLSchema = (schema: any, paths: string[]) => {
    const pathSet = new Set(paths); // Use set for fast lookup
    const filteredChildren = [];
    // Can recursively search here and set a level based on the dot-separated keyList to stop at a certain depth
    let highestLevel = 1;
    forEach(paths, (str) => {
      const level = str.split('.').length;
      if (level > highestLevel) {
        highestLevel = level;
      }
    });

    const filterChildren = (children: any, level = 0) => {
      const deepLevel = add(level, 1);
      return children.reduce((acc: any, child: any) => {
        // Generate the key for the current node
        const key = child.key;

        // Check if the current node is in the path set
        if (pathSet.has(key)) {
          if (child.children || has(graphqlObjects, child?.itemKind)) {
            const newChildren = size(child.children)
              ? child.children
              : map(graphqlObjects?.[child?.itemKind]?.children, (e) => ({
                ...e,
                key: `${child.key}.${e?.name}`,
                path: `${child.key}.${e?.name}`,
                ...(has(graphqlObjects, e?.itemKind) ? { children: [] } : { isLeaf: true }),
              }));
            const filtered = filterChildren(newChildren, deepLevel);
            if (filtered.length > 0) {
              acc.push({
                ...child,
                children: filtered,
              });
            }
          } else {
            acc.push(child);
          }
        }
        return acc;
      }, []);
    };

    // Filter on Query's children
    filteredChildren.push(...filterChildren(schema.children));

    return {
      ...schema,
      children: filteredChildren,
    };
  };

  const recursiveMerge = (
    qAst: object,
    sAst: object,
    prefix: string,
    checkKeys: string[],
    allKeys: string[],
    backFilterData?: FilterDataType
  ) => {
    return mergeWith(qAst, sAst, (qValue, sValue, key, object) => {
      if (isEqual(key, 'selections') && isArray(qValue) && isArray(sValue)) {
        const arr = unionBy(qValue, sValue, 'name.value').reduce((pre, item) => {
          const valueKey = get(item, 'name.value');
          const qValueIndex = findIndex(qValue, (e) => isEqual(get(e, 'name.value'), valueKey));
          const sValueIndex = findIndex(sValue, (e) => isEqual(get(e, 'name.value'), valueKey));
          if (qValueIndex !== -1 && sValueIndex !== -1) {
            const qValueItem = qValue[qValueIndex];
            const sValueItem = sValue[sValueIndex];
            pre.push(
              recursiveMerge(
                qValueItem,
                sValueItem,
                `${prefix}.${valueKey}`,
                checkKeys,
                allKeys,
                backFilterData
              )
            );
          } else {
            const item = qValueIndex === -1 ? sValue[sValueIndex] : qValue[qValueIndex];
            const itemKey = get(item, 'name.value');
            if (allKeys.includes(`${prefix}.${itemKey}`)) {
              if (checkKeys.includes(`${prefix}.${itemKey}`)) {
                const filterObj = backFilterData || filterData;
                pre.push({
                  ...item,
                  arguments: has(filterObj, `${prefix}.${itemKey}`)
                    ? createArguments(filterObj[`${prefix}.${itemKey}`])
                    : [],
                });
              } else if (qValueIndex !== -1) {
                if (
                  has(item, 'selectionSet.selections') &&
                  isArray(get(item, 'selectionSet.selections'))
                ) {
                  const list = getCurrentSelectionsKeys(
                    get(item, 'selectionSet.selections'),
                    `${prefix}.${itemKey}`
                  );
                  const childList = new Set(allKeys);
                  const hasIdNot = some(list, (id) => !childList.has(id));
                  if (hasIdNot) {
                    const childArr = recursiveMerge(
                      item,
                      { selectionSet: { kind: Kind.SELECTION_SET, selections: [] } },
                      `${prefix}.${itemKey}`,
                      checkKeys,
                      allKeys,
                      backFilterData
                    );
                    pre = concat(pre, childArr);
                  }
                }
              }
            } else {
              const filterObj = backFilterData || filterData;
              pre.push({
                ...item,
                arguments: has(filterObj, `${prefix}.${itemKey}`)
                  ? createArguments(filterObj[`${prefix}.${itemKey}`])
                  : [],
              });
            }
          }
          return pre;
        }, []);
        return arr;
      }
      if (isEqual(key, 'arguments')) {
        const valueKey = get(object, 'name.value');
        const filterObj = backFilterData || filterData;
        const pre = backFilterData ? `${prefix}` : `${prefix}.${valueKey}`;
        if (has(filterObj, pre)) {
          return createArguments(filterObj[pre]);
        }
      }
      return undefined;
    });
  };

  const getCurrentSelectionsKeys = (arr: any[], prefix: string) => {
    return arr.reduce((pre, item) => {
      if (has(item, 'selectionSet.selections') && isArray(get(item, 'selectionSet.selections'))) {
        pre = concat(
          pre,
          getCurrentSelectionsKeys(
            get(item, 'selectionSet.selections'),
            `${prefix}.${get(item, 'name.value')}`
          )
        );
      } else {
        pre.push(`${prefix}.${get(item, 'name.value')}`);
      }
      return pre;
    }, []);
  };

  const graphqlObjects: AnyObject = useMemo(() => {
    if (has(data?.query_schema, 'objects')) {
      return transformStructure({ objects: (data?.query_schema as any)?.objects })?.objects || {};
    }
    return {};
  }, [data?.query_schema]);

  const getPartialStrings = (str: string) => {
    const parts = str.split('.');
    const results = [];

    for (let i = 1; i <= parts.length; i++) {
      results.push(parts.slice(0, i).join('.'));
    }

    return results;
  };

  const gerRemoveKeys = (checked: string[], key: string) => {
    if (key.includes('.')) {
      const keysPathList = getPartialStrings(key).reverse().slice(1);
      const keys = keysPathList.reduce(
        (pre, item) => {
          if (!some(pre, (i) => startsWith(i, item) && !isEqual(i, item))) {
            pre = filter(pre, (e) => !startsWith(e, item));
          }
          return pre;
        },
        [...checked]
      );
      return keys;
    }
    return checked;
  };

  const customGetKeys = (checked: string[], e: any) => {
    let keys = [];
    if (e?.checked) {
      const list = checked?.reduce(
        (pre, selectKey) => {
          if (includes(selectKey, '.')) {
            const res = getPartialStrings(selectKey);
            pre = union(pre.concat(res));
          }
          return pre;
        },
        [...checked]
      );
      if (has(graphqlObjects, e?.node?.itemKind)) {
        const children = filter(
          graphqlObjects[e?.node?.itemKind]?.children,
          (i) => !has(graphqlObjects, i?.itemKind)
        );
        const childrenKeys = children?.map((i) => `${e?.node?.key}.${i?.name}`);
        keys = union(concat(list, childrenKeys));
      } else {
        keys = union(list);
      }
    } else {
      if (has(graphqlObjects, e?.node?.itemKind)) {
        const removeList = filter(checked, (i) => startsWith(i, e?.node?.key));
        keys = difference([...checked], removeList);
        keys = gerRemoveKeys(keys, e?.node?.key);
      } else {
        keys = difference([...checked], [e?.node?.key]);
        keys = gerRemoveKeys(keys, e?.node?.key);
      }
    }
    return keys;
  };

  const getAllKeys = (checkKeys: string[]) => {
    let highestLevel = 1;
    let queryKeys = [];
    if (searchData?.query) {
      try {
        const data = graphql2json(searchData?.query);
        const { keys } = getKeys([data]);
        queryKeys = keys;
      } catch (err) { }
    }
    forEach(union(concat(checkKeys, queryKeys)), (str) => {
      const level = str.split('.').length;
      // The split array length is one more than the number of dots (including empty string or the first part), so this is the correct level
      if (level > highestLevel) {
        highestLevel = level;
      }
    });

    const filterAllKeys = (children: any, level = 1) => {
      const deepLevel = add(level, 1);
      return children.reduce((acc: string[], child: any) => {
        const key = child.key;
        acc.push(key);
        if (level <= highestLevel) {
          if (child.children || has(graphqlObjects, child?.itemKind)) {
            const newChildren = size(child.children)
              ? child.children
              : map(graphqlObjects?.[child?.itemKind]?.children, (e) => ({
                ...e,
                key: `${child.key}.${e?.name}`,
                path: `${child.key}.${e?.name}`,
                ...(has(graphqlObjects, e?.itemKind) ? { children: [] } : { isLeaf: true }),
              }));
            const keys = filterAllKeys(newChildren, deepLevel);
            acc = concat(acc, keys);
          }
        }
        return acc;
      }, []);
    };
    const allKeys = filterAllKeys(treeData);
    return allKeys;
  };

  const onCheck: TreeProps['onCheck'] = ({ checked }: any, e) => {
    const keys = customGetKeys(checked, e);
    setCheckedKeys(keys as string[]);
    try {
      const obj = filterGraphQLSchema(treeData[0], keys as string[]);
      let queryAst: any = {};
      try {
        queryAst = parse(searchData.query);
      } catch (err) { }
      const ast = {
        kind: Kind.DOCUMENT,
        definitions: [createOperationDefinition(obj)],
      };
      const allKeys = getAllKeys(union(keys));
      const mergeAst = recursiveMerge(
        cloneDeep(queryAst),
        cloneDeep(ast),
        'Query',
        union(keys as string[], e?.halfCheckedKeys || []) as string[],
        allKeys
      );
      const query = print(mergeAst as ASTNode);
      onChangeQueryItem('query', query);
    } catch (err) { }
  };

  const onChangeQueryItem = useMemoizedFn(
    <K extends keyof GraphQLRequestBodyQueryItem>(key: K, val: string) => {
      const index = findIndex(data.query_list, (e) => isEqual(e.param_id, apiData?.search_id));
      const path = isEqual(index, -1) ? 0 : index;
      const newData = produce(data, (draft) => {
        draft.query_list[path] = { ...draft.query_list[path], [key]: val };
      });
      onChange(newData);
    }
  );

  const getRealUrl = async () => {
    return '';
  };

  const refreshSchema = async () => {
    try {
      updateSchemaLoading(true);

      window?.vscode.postMessage({
        action: 'getGraphQLSchema',
        data: {
          apiData,
          currentServerId
        }
      });

    } catch (error) {
      message.error(t('graphql.refresh_fail'));
    }
  };

  const refreshCheck = (data: FilterDataType) => {
    try {
      const obj = filterGraphQLSchema(treeData[0], checkedKeys);
      let queryAst: any = {};
      try {
        queryAst = parse(searchData.query);
      } catch (err) { }
      const ast = {
        kind: Kind.DOCUMENT,
        definitions: [createOperationDefinition(obj)],
      };
      const allKeys = getAllKeys(checkedKeys);
      const mergeAst = recursiveMerge(
        cloneDeep(queryAst),
        cloneDeep(ast),
        'Query',
        checkedKeys,
        allKeys,
        data
      );
      const query = print(mergeAst as ASTNode);
      onChangeQueryItem('query', query);
    } catch (err) { }
  };

  return (
    <GraphQLSchemaProvider.Provider value={{ filterData, setFilterData, refreshCheck }}>
      <MainContainer>
        <ResizablePanels
          panelGroupProps={{
            autoSaveId: 'graphql_debug_container_resize_save_id',
            direction: 'horizontal',
          }}
          leftPanelProps={{ ...panelProps, collapseTitle: 'GraphQL Schema' }}
          rightPanelProps={{ ...panelProps, collapseTitle: 'queryEdit' }}
          leftPanel={
            <SuspenseContent>
              <Flex vertical style={{ height: '100%' }}>
                <Flex className="edit-header" align="center" justify="space-between">
                  GraphQL Schema
                  <Button
                    onClick={refreshSchema}
                    type="text"
                    size="small"
                    icon={<IconFont type="icon-refresh" />}
                  >
                    {t('base.refresh')}
                  </Button>
                </Flex>
                <Flex flex={1} style={{ height: 0 }}>
                  <Spin wrapperClassName={'schema-loading'} spinning={schemaLoading}>
                    {isEmpty(treeData) ? (
                      <Empty>
                        <Button size="small" onClick={refreshSchema} type="primary" mode="light">
                          {t('graphql.get_schema')}
                        </Button>
                      </Empty>
                    ) : (
                      <SchemaTree
                        checkable
                        treeData={treeData}
                        setTreeData={setTreeData}
                        querySchema={data.query_schema}
                        checkedKeys={checkedKeys}
                        onCheck={onCheck}
                        checkStrictly
                      />
                    )}
                  </Spin>
                </Flex>
              </Flex>
            </SuspenseContent>
          }
          rightPanel={
            <SuspenseContent>
              <Spin wrapperClassName={'schema-loading'} spinning={schemaLoading}>
                <ResizablePanels
                  ref={variablesPanelRef}
                  panelGroupProps={{
                    autoSaveId: 'graphql_debug_queryEdit_container_resize_save_id',
                    direction: 'vertical',
                  }}
                  leftPanelProps={{ ...panelProps, defaultSize: 95, collapseTitle: 'Query' }}
                  rightPanelProps={{ ...panelProps, defaultSize: 5, collapseTitle: 'Variable' }}
                  leftPanel={
                    <SuspenseContent>
                      <Flex vertical style={{ height: '100%' }}>
                        <Flex className="edit-header" align="center" justify="space-between">
                          Query
                          <Button
                            onClick={() => {
                              onChangeQueryItem('query', print(parse(searchData.query)));
                            }}
                            type="text"
                            size="small"
                            icon={<IconFont type="icon-clean" />}
                          >
                            {t('graphql.format')}
                          </Button>
                        </Flex>
                        <Flex flex={1} style={{ height: 0 }}>
                          <MonacoEditor
                            onChange={(v) => {
                              onChangeQueryItem('query', v);
                              rawToTree(v);
                            }}
                            ref={monacoEditorGraphqlRef}
                            language="graphql"
                            value={searchData.query}
                          />
                        </Flex>
                      </Flex>
                    </SuspenseContent>
                  }
                  rightPanel={
                    <SuspenseContent>
                      <Flex vertical style={{ height: '100%' }}>
                        <Flex className="edit-header" align="center" justify="space-between">
                          Variables
                          <Button
                            onClick={() => monacoEditorJsonRef?.current?.formatEditor()}
                            type="text"
                            size="small"
                            icon={<IconFont type="icon-clean" />}
                          >
                            {t('graphql.format')}
                          </Button>
                        </Flex>
                        <Flex flex={1} style={{ height: 0 }}>
                          <MonacoEditor
                            onChange={(v) => onChangeQueryItem('variables', v)}
                            ref={monacoEditorJsonRef}
                            language="json"
                            value={searchData.variables}
                          />
                        </Flex>
                      </Flex>
                    </SuspenseContent>
                  }
                />
              </Spin>
            </SuspenseContent>
          }
        />
      </MainContainer>
    </GraphQLSchemaProvider.Provider>
  );
});

export default Main;
