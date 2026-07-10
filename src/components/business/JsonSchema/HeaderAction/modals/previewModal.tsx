import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from 'antd';

import { useMemoizedFn } from 'ahooks';
import MockSchema from 'apipost-mock-schema';
import { cloneDeep, isObject } from 'lodash';

import MonacoEditor from '@/components/business/MonacoEditor';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import Modal from '@/components/ui/Modal';
import useSchemasHook from '@/hooks/useSchemas';
import { useSchemas } from '@/store';
import { EditFormat } from '@/utils/common';
import { parseModelToJsonSchema } from '@/utils/dataModel';

import { PreviewContainer, PreviewTitleContainer } from '../style';

const PreviewModal: React.FC<any> = (props) => {
  const { value, onCancel, themeToken } = props;
  const { schemasBaseData } = useSchemas((state) => state);
  const { getProxyMockRulesList } = useSchemasHook();
  const { t } = useTranslation();
  const [viewText, setViewText] = useState('');

  useEffect(() => {
    if (isObject(value)) {
      handleViewSchemaText(value);
    }
  }, [value]);

  const handleViewSchemaText = useMemoizedFn(async (dataModel) => {
    const schema = await parseModelToJsonSchema(dataModel, [], schemasBaseData || {});
    const schemaData = cloneDeep(schema);
    if (!isObject(schemaData)) {
      return;
    }
    const mock_rules = getProxyMockRulesList();
    new (MockSchema as any)({ app: 'echoapi' })
      .mock(schemaData, mock_rules)
      .then((mockData: any) => {
        if (isObject(mockData)) {
          const beautifyText = EditFormat(JSON.stringify(mockData)).value;
          setViewText(beautifyText);
        } else {
          setViewText(mockData);
        }
      })
      .catch(() => {
        message.error(t('supplement.parse_err'));
        setViewText('');
      });
  });

  const handleUpdateText = useMemoizedFn(() => {
    handleViewSchemaText(value);
  });

  return (
    <Modal
      width={880}
      open
      title={
        <PreviewTitleContainer>
          <span>{t('common.schema.view')}</span>
          <Button onClick={handleUpdateText} icon={<IconFont type="icon-refresh" />}></Button>
        </PreviewTitleContainer>
      }
      onCancel={onCancel}
      footer={null}
    >
      <PreviewContainer $token={themeToken}>
        <MonacoEditor readOnly height={400} language="json" value={viewText || ''} />
      </PreviewContainer>
    </Modal>
  );
};

export default memo(PreviewModal);
