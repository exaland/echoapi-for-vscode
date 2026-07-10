import { FC, memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import context from '@/components/business/OpenApiRawEditor/visualizationContext';
import DesignRequestPanel from '@/components/business/DesignRequestPanel';
import { OpenApiMainObj } from '@/types/apis/api';

import { RequestContainer } from './style';

interface Props {
  openApiMainObj: OpenApiMainObj;
  onOpenApiMainChange: (data: OpenApiMainObj) => void
}
const Request: FC<Props> = memo((props) => {
  const { openApiMainObj, onOpenApiMainChange } = props;
  const { Provider } = context;
  const handleOnChange = useMemoizedFn((data: OpenApiMainObj['parameters']) => {
    const newData = produce(openApiMainObj, (draft) => {
      draft.parameters = data;
    });

    onOpenApiMainChange(newData);
  });

  const handleOnBodyChange = useMemoizedFn((data: OpenApiMainObj['requestBody']) => {
    const newData = produce(openApiMainObj, (draft) => {
      draft.requestBody = data;
    });

    onOpenApiMainChange(newData);
  });

  return (
    <RequestContainer>
        <DesignRequestPanel
          tabsDefaultActiveKey={'body'}
          includesTabs={['Headers', 'Params', 'Path', 'Body', 'Cookie']}
          requestData={openApiMainObj.parameters}
          onRequestDataChange={handleOnChange}
          requestBody={openApiMainObj.requestBody}
          onRequestBodyChange={handleOnBodyChange}
        />
    </RequestContainer>
  );
});

export default Request;
