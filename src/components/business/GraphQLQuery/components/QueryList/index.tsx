import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useMemoizedFn } from 'ahooks';
import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { cloneDeep, concat, findIndex, head, isEqual, set } from 'lodash';

import { ListSideBar } from '@/components/business';
import GraphQLQueryContext from '@/components/business/GraphQLQuery/context/GraphQLQueryContext';
import { DEFAULT_GRAPHQL_QUERY_ITEM } from '@/constants/apis/request';
import { GraphQLRequestBody } from '@/types/apis/request';

interface Props {
  data: GraphQLRequestBody;
  onChange: <K extends keyof GraphQLRequestBody>(
    value: GraphQLRequestBody[K],
    search_id?: string
  ) => void;
  onAdd?: () => void;
}

const Index = (props: Props) => {
  const { t } = useTranslation();
  const { data, onChange, onAdd } = props;
  const { apiData, onChange: apiDataChange } = useContext(GraphQLQueryContext);

  const add = () => {
    const param_id = snowflakeId();
    onChange(
      {
        ...data,
        query_list: concat(data.query_list, [{ ...DEFAULT_GRAPHQL_QUERY_ITEM, param_id }]),
      },
      param_id
    );
    onAdd?.();
  };

  const onRemove = useMemoizedFn((param_id: string) => {
    let search_id;
    const activeKey = apiData?.search_id || head(data.query_list)?.param_id;
    const query_list = produce(data.query_list, (draft) => {
      const messageIndex = findIndex(data.query_list, (item) => isEqual(item.param_id, param_id));
      if (messageIndex > -1) {
        draft.splice(messageIndex, 1);
      }
      if (isEqual(activeKey, param_id)) {
        const nextActiveKey = draft[messageIndex - 1]?.param_id || head(draft)?.param_id;
        search_id = nextActiveKey;
      }
    });

    onChange(
      {
        ...data,
        query_list,
      },
      search_id
    );
  });

  const onEdit = (index: number, { value }: { key: string; value: string }) => {
    const queryList = cloneDeep(data.query_list);
    set(queryList, index, { ...queryList[index], name: value?.trim() || t('graphql.cus_search') });
    onChange({
      ...data,
      query_list: queryList,
    });
  };

  const onSelect = (param_id: string) => {
    apiDataChange('search_id', param_id);
  };

  return (
    <ListSideBar
      value={data.query_list}
      handleSelect={onSelect}
      activeId={apiData?.search_id || head(data.query_list)?.param_id}
      handleEdit={onEdit}
      handleAdd={add}
      handleRemove={onRemove}
    />
  );
};

export default Index;
