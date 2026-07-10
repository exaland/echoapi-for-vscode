import RequestPanel from '@/components/business/Request';
import { calcTabLineBodyHeaderNum } from '@/utils/common';

import { RequestBody } from './components';

interface Props {
  requestData: any;
  onRequestDataChange: (value: any) => void;
  targetId?: string;
  isSystem?: boolean;
  defaultTabKey?:string;
}

const RequestGlobal = (props: Props) => {
  const { targetId,defaultTabKey, requestData, onRequestDataChange, isSystem = false } = props;

  const extra = [
    {
      key: 'cusBody',
      label: 'Body',
      children: <RequestBody onRequestDataChange={onRequestDataChange} requestData={requestData} />,
      countParams: {
        dataSource: requestData?.body?.parameter,
        customCalcFun: calcTabLineBodyHeaderNum,
      },
    },
  ];

  return (
    <RequestPanel
      tabOptions={{
        defaultActiveKey:defaultTabKey === 'Body' ? 'cusBody' : defaultTabKey
      }}
      isSystem={isSystem}
      paramsType="global"
      requestData={requestData}
      onRequestDataChange={onRequestDataChange}
      includesTabs={['Headers', 'cusBody', 'Params', 'Auth', 'Cookie', 'preRequest', 'postResponse']}
      extra={extra}
    />
  );
};

export default RequestGlobal;
