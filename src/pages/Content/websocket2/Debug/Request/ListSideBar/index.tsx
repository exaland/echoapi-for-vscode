import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import { useSafeState } from 'ahooks';
import classNames from 'classnames';
import { isEqual, map, size } from 'lodash';

import { IconFont } from '@/components/ui';

import InputEdit from './InputEdit';

import { ListSideBarContainer } from './style';

interface Props {
  handleSelect: (p: string) => void;
  value: { name: string; param_id: string }[];
  activeId: string | undefined;
  handleEdit: (i: number, { key, value }: { key: string; value: string }) => void;
  handleAdd: () => void;
  handleRemove: (p: string) => void;
}

const ListSideBar = (props: Props) => {
  const { t } = useTranslation();
  const [expand, setExpand] = useSafeState<boolean>(false);
  const { value, activeId, handleSelect, handleEdit, handleAdd, handleRemove } = props;

  return (
    <ListSideBarContainer>
      <Flex vertical className={classNames('grpc-tree-wrap', { expand })}>
        <div className="basic-tabs-con">
          <ul>
            {map(value, (item, index) => {
              return (
                <InputEdit
                  key={item.param_id}
                  active={isEqual(item.param_id, activeId)}
                  label={item.name}
                  curKey={item.param_id}
                  canDelete={size(value) > 1}
                  onSelect={handleSelect}
                  onEdit={(v) => handleEdit(index, v)}
                  onRemove={handleRemove}
                />
              );
            })}
          </ul>
        </div>
        <div className="add-btn-con">
          <Button
            onClick={handleAdd}
            icon={<IconFont type="icon-add-line" />}
            type="dashed"
            size="small"
            block
          >
            {t('supplement.msg')}
          </Button>
        </div>
      </Flex>
      <div className="expand-divider">
        <div className="icon-wrap" onClick={() => setExpand(!expand)}>
          <IconFont type="icon-drop-down" rotate={expand ? -90 : 90} />
        </div>
      </div>
    </ListSideBarContainer>
  );
};

export default ListSideBar;
