import React, { memo } from 'react';

import HeaderAction from './HeaderAction';
import JsonSchemaTable from './JsonSchemaTable';

import JsonSchemaContainer from './style';

type Props = {
  value?: any;
  onChange?: (newVal: any) => void;
  onBeforeLink?: (refKeys: string[]) => boolean;
  model_id?: string;
  importTitle?: string;
  isShowHeaderAction?: boolean;
  models?: any;
};

const Index: React.FC<Props> = (props) => {
  const {
    value,
    onChange = () => {},
    importTitle,
    models,
    model_id,
    isShowHeaderAction = true,
  } = props;

  return (
    <JsonSchemaContainer>
      {isShowHeaderAction && (
        <HeaderAction
          style={{ display: isShowHeaderAction ? 'none' : 'block' }}
          value={value}
          onChange={onChange}
          importTitle={importTitle}
        />
      )}
      <JsonSchemaTable model_id={model_id} models={models} value={value} onChange={onChange} />
    </JsonSchemaContainer>
  );
};

export default memo(Index);
