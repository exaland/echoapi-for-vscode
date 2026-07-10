import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from 'antd';

import { useMemoizedFn } from 'ahooks';
import { isObject, isString } from 'lodash';

import MonacoEditor from '@/components/business/MonacoEditor';
import Modal from '@/components/ui/Modal';
import { EditFormat, isJSON } from '@/utils/common';

import { EditRawContainer } from '../style';

const EditRow: React.FC<any> = (props) => {
  const { t } = useTranslation();
  const { value, onChange, onCancel } = props;

  const [tempText, setTempText] = useState(value);

  const handleConfirm = useMemoizedFn(() => {
    if (!isJSON(tempText)) {
      message.error(t('supplement.only_json_pick'));
      return;
    }
    const data = JSON.parse(tempText);
    onChange(data);
    onCancel();
  });

  useEffect(() => {
    let jsonText = null;
    try {
      jsonText = JSON.stringify(tempText);
    } catch (ex) {
      jsonText = '';
      message.error(t('supplement.parse_exception'));
    }
    const beautifyText = isObject(tempText) ? EditFormat(jsonText).value : '';

    setTempText(beautifyText);
  }, []);

  return (
    <Modal
      open
      width={880}
      title="Raw"
      onCancel={onCancel}
      onOk={handleConfirm}
      cancelText={t('supplement.cancel')}
      okText={t('supplement.confirm')}
    >
      <EditRawContainer>
        {isString(tempText) && (
          <MonacoEditor
            language="json"
            showFullScreenBtn={false}
            value={tempText}
            onChange={setTempText}
          />
        )}
      </EditRawContainer>
    </Modal>
  );
};

export default memo(EditRow);
