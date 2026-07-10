import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import ResponsePanel from '@/components/business/Response';
import { useApis } from '@/store';
import { ApiComponentType, GraphQLDetailsData } from '@/types/apis/graphql';

import { ResponseContainer } from './style';

const Response = memo((props: ApiComponentType) => {
  const { apisData, onApisDataChange } = props;

  const curApiSendingData = useApis((state) => state.currentSendingData);

  const handleOnChange = useMemoizedFn((data: GraphQLDetailsData['response']) => {
    const newData = produce(apisData, (draft) => {
      draft.response = data;
    });
    onApisDataChange(newData);
  });

  return (
    <ResponseContainer>
      <ResponsePanel
        showDownload
        resultIncludesTabs={['beautify', 'visualization']}
        includesTabs={[
          'realtime',
          'requestHeader',
          'responseHeader',
          'cookie',
          'realRequest',
          'console',
        ]}
        responseData={apisData.response}
        sendingData={curApiSendingData}
        onResponseDataChange={handleOnChange}
      />
    </ResponseContainer>
  );
});

export default Response;
