import React, { memo, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useSafeState } from 'ahooks';
import { isObject, isPlainObject } from 'lodash';
import { isEmpty } from 'lodash';

import useTheme from '@/hooks/useTheme';

import { DEFAULT_LAYOUTS } from './constant';
import context, { LayoutProps } from './context';
import ItemNode from './itemNode';
import dataModels from './utils/dataModels';

import { SchemaWrapper } from './style';

type Props = {
  models: { [model_id: string]: any }; // Model objects available for dropdown selection when referencing models
  value: any; // Schema data
  model_id: string | undefined; // Model ID
  onChange: (newVal: any) => void; // Modify schema data
};

const Template: React.FC<Props> = (props) => {
  const { models, value, onChange, model_id } = props;
  const { themeToken } = useTheme();
  const { projectId } = useParams();

  const { Provider } = context;

  const refTable = useRef(null);
  const shemaData = isPlainObject(value) ? value : { type: 'object' };

  const [layouts, setLayouts] = useSafeState<LayoutProps>(DEFAULT_LAYOUTS);

  const getModelItem = useMemoizedFn((model_id: string) => {
    if (isObject(models?.[model_id])) {
      return models?.[model_id];
    }
    return null;
  });

  const getModelDetail = async (model_id: string) => {
    try {
      return {};
    } catch (err) {
      return {};
    }
  };

  const handleRowChange = useMemoizedFn((nodeKey, newVal) => {
    onChange(newVal);
  });

  const parentModels = useRef(isEmpty(model_id) ? [] : [model_id]);

  const modelUtils = useMemo(() => {
    return new dataModels(models);
  }, [models]);

  return (
    <Provider
      value={{
        refTable,
        layouts,
        setLayouts,
        model_id,
        schemaData: models,
        getModelItem,
        getModelDetail,
        parseModelToJsonSchema: modelUtils?.parseModelToJsonSchema,
      }}
    >
      <SchemaWrapper $token={themeToken}>
        <div ref={refTable} className="template-table">
          <ItemNode
            enableDelete={false}
            deepIndex={0}
            readOnly
            value={shemaData}
            nodeKey="rootNode"
            onChange={handleRowChange}
            isRequired
            singleOnly
            parentModels={parentModels}
          />
        </div>
      </SchemaWrapper>
    </Provider>
  );
};

export default memo(Template);
