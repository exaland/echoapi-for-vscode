import React, { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from 'antd';

import { useSafeState } from 'ahooks';
import cn from 'classnames';

import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import useTheme from '@/hooks/useTheme';

import LinkModal from '../../modals/link';

import { EmptyWarper } from './style';

type Props = {
  deepIndex: number;
  nodeKey: string;
  onNodeKeyChange: (preKey: string, newKey: string) => void;
  onDeleteNode: () => void;
  onLinkSchema: (schema: any) => void;
};

const EmptyItem: React.FC<Props> = (props) => {
  const { deepIndex, nodeKey, onNodeKeyChange, onDeleteNode, onLinkSchema } = props;
  const { t } = useTranslation();
  const [showModal, setShowModal] = useSafeState(false);
  const isComposition = useRef(false);
  const [compositionValue, setCompositionValue] = useSafeState<string | undefined>('');
  const { themeToken } = useTheme();

  const handleLinkSchema = (schema: any) => {
    setShowModal(false);
    onLinkSchema(schema);
  };

  const handleChangeKey: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!isComposition.current) {
      onNodeKeyChange(nodeKey, e.target.value);
    } else {
      setCompositionValue(e.target.value);
    }
  };

  const onCompositionEnd = (e: any) => {
    if (e?.type === 'compositionend') {
      isComposition.current = false;
      setCompositionValue(undefined);
      onNodeKeyChange(nodeKey, e.target.value);
    } else {
      isComposition.current = true;
    }
  };
  const IndentPanel = (deepIndex: any) => {
    // Generate indent array based on deepIndex
    const indents = Array.from({ length: deepIndex }, (_, index) => (
      <div key={index} className="indent-panel"></div>
    ));

    return indents;
  };
  return (
    <>
      <LinkModal open={showModal} onLinkSchema={handleLinkSchema} />
      <div className={cn('schema-td', 'table-td')}>
        <EmptyWarper $token={themeToken}>
          <div className={cn('schema-td-warper', 'schema-width-auto')}>
            {IndentPanel(deepIndex)}
            <Input
              size="small"
              spellCheck={false}
              readOnly={false}
              style={{ width: 140, border: 'none', boxShadow: 'none' }}
              placeholder={t('common.schema.field_name')}
              value={compositionValue || `${nodeKey}`}
              onChange={handleChangeKey}
              onCompositionStart={onCompositionEnd}
              onCompositionUpdate={onCompositionEnd}
              onCompositionEnd={onCompositionEnd}
            />
            <div className="text-panel">
            </div>
            <div className="btn-list ">
              <Button
                icon={<IconFont type="icon-delete" />}
                type="text"
                size="small"
                onClick={onDeleteNode}
              ></Button>
            </div>
          </div>
        </EmptyWarper>
      </div>
    </>
  );
};

export default memo(EmptyItem);
