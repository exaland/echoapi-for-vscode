import { useEffect, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { isEmpty } from 'lodash';

import { DEFAULT_GRAPHQL_QUERY_ITEM } from '@/constants/apis/request';
import { GraphQLChangeFuncType, GraphQLDetailsData } from '@/types/apis/graphql';

import { QueryList } from './components';
import GraphQLQueryContext from './context/GraphQLQueryContext';
import Main from './main';

import { GraphQLContainer } from './style';

interface Props {
  requestData: GraphQLDetailsData['request'];
  apiData: GraphQLDetailsData;
  target_id: string;
  onChange: GraphQLChangeFuncType<GraphQLDetailsData>;
}

const GraphQLQuery = (props: Props) => {
  const { requestData, apiData, onChange } = props;
  const mainRef = useRef<any>();

  useEffect(() => {
    if (isEmpty(requestData.body.query_list)) {
      const param_id = snowflakeId();
      handleRequestBodyChange({
        ...requestData.body,
        query_list: [
          {
            ...DEFAULT_GRAPHQL_QUERY_ITEM,
            param_id,
          },
        ],
      });
    }
  }, []);

  const handleRequestBodyChange = useMemoizedFn((newVal, search_id?: string) => {
    const newData = produce(requestData, (draft) => {
      draft.body = newVal;
    });

    onChange?.('request', newData, search_id);
  });

  return (
    <GraphQLQueryContext.Provider
      value={{
        apiData,
        onChange,
      }}
    >
      <GraphQLContainer>
        <QueryList data={requestData.body} onChange={handleRequestBodyChange} />
        <Main ref={mainRef} data={requestData.body} onChange={handleRequestBodyChange} />
      </GraphQLContainer>
    </GraphQLQueryContext.Provider>
  );
};

export default GraphQLQuery;
