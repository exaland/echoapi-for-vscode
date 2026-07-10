import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Popconfirm, Typography } from 'antd';

import { useSafeState } from 'ahooks';
import classnames from 'classnames';

import IconFont from '@/components/ui/IconFont';

const { Paragraph } = Typography;
interface Props {
  active: boolean;
  curKey: string;
  label: string;
  canDelete: boolean;
  onSelect: (p: string) => void;
  onEdit?: (data: { key: string; value: string }) => void;
  onRemove?: (key: string) => void;
}
const InputEdit = (props: Props) => {
  const { t } = useTranslation();
  const { active, curKey, label, canDelete, onSelect, onEdit, onRemove } = props || {};

  const [edit, setEdit] = useSafeState(true);
  const [value, setValue] = useSafeState(label);

  useEffect(() => {
    setValue(label);
  }, [label]);

  return (
    <li
      className={classnames({
        'basic-tab-bar': true,
        'basic-tab-bar-active': active,
      })}
      onDoubleClick={() => setEdit(false)}
      onClick={() => onSelect?.(curKey)}
    >
      {!edit ? (
        <Input
          size="small"
          className={classnames({
            'edit-input': !edit,
          })}
          style={{ width: 100 }}
          autoFocus
          onBlur={() => {
            onEdit && onEdit({ key: curKey, value: value });
            setEdit(true);
          }}
          onChange={(e) => setValue(e?.target?.value || '')}
          readOnly={edit}
          value={value}
        />
      ) : (
        <Paragraph ellipsis style={{ marginBottom: 0, width: 100 }}>
          {value}
        </Paragraph>
      )}

      {canDelete && (
        <Popconfirm
          title={t('supplement.delete')}
          description={t('supplement.del_this_param')}
          onConfirm={(e) => {
            e?.stopPropagation();
            onRemove?.(curKey);
          }}
          okText={t('supplement.confirm')}
          cancelText={t('supplement.cancel')}
        >
          <IconFont
            type="icon-small-close"
            className="icon-close"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Popconfirm>
      )}
    </li>
  );
};

export default InputEdit;
