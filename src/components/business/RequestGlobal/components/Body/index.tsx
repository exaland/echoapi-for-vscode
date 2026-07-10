import produce from 'immer';
import { get } from 'lodash';

import RequestTable from '@/components/business/RequestTable';

import { RequestBodyContainer } from './style';
import { useTableColumnSwitchConfig } from '@/hooks';

const Index = ({ requestData, onRequestDataChange }: any) => {
  const { columnSwitchConfig, onColumnSwitchConfig } = useTableColumnSwitchConfig(
    'request_body_column_switch'
  );
  const handleOnChange = (value: any) => {
    const newData = produce(requestData, (draft: any) => {
      draft.body = {
        parameter: value,
      };
    });

    onRequestDataChange(newData);
  };

  return (
    <RequestBodyContainer>
      <RequestTable
        dataSource={get(requestData, 'body.parameter') || []}
        onChange={handleOnChange}
        columnSwitchConfig={columnSwitchConfig}
        onColumnSwitchConfig={onColumnSwitchConfig}
      />
    </RequestBodyContainer>
  );
};

export default Index;
