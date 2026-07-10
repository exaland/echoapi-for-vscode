import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Dropdown,
  Flex,
  Input,
  Popconfirm, // Popconfirm,
  Typography,
} from 'antd';

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
  }, [label, edit]);
  const Items = useMemo(() => {
    const items = [
      {
        key: 'edit',
        label: (
          <Flex className="item-label">
          <IconFont type="icon-edit" style={{ fontSize: 'var(--font-size-16)' }} />
          <span>{t('supplement.edit')}</span>
        </Flex>
        ),
        danger: false,
      },
    ];
    canDelete &&
      items.push({
        key: 'delete',
        label: (
          <Popconfirm
            title={t('supplement.delete')}
            description={t('supplement.del_this_param')}
            onConfirm={(e) => {
              e?.stopPropagation();
              onRemove?.(curKey);
            } }
            okText={t('supplement.confirm')}
            cancelText={t('supplement.cancel')}
          >
            <Flex className="item-label">
              <IconFont type="icon-delete" style={{ fontSize: 'var(--font-size-16)' }} />
              <span>{t('supplement.delete')}</span>
            </Flex>
          </Popconfirm>
        ) as any,
        danger: true,
      });
    return items;
  }, [canDelete]);
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
          style={{ width: 120 }}
          autoFocus
          onBlur={() => {
            onEdit && onEdit({ key: curKey, value: value });
            setEdit(true);
          }}
          onPressEnter={() => {
            onEdit && onEdit({ key: curKey, value: value });
            setEdit(true);
          }}
          onChange={(e) => setValue(e?.target?.value || '')}
          readOnly={edit}
          value={value}
        />
      ) : (
        <Paragraph
          ellipsis={{
            tooltip: value,
          }}
          style={{ marginBottom: 0, width: 120 }}
        >
          {value}
        </Paragraph>
      )}
      <Dropdown
        menu={{
          items: Items,
          onClick: (node) => {
            node?.domEvent?.stopPropagation();
            if (node.key === 'edit') {
              setEdit(false);
              return;
            }
            if (node.key === 'delete') {
              // onRemove?.(curKey);
              return;
            }
          },
        }}
        trigger={['click']}
      >
        <IconFont
          type="icon-navi-more"
          className="icon-close"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </Dropdown>
    </li>
  );
};

export default InputEdit;
