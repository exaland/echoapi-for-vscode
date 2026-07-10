import { ChangeEvent, FC, MouseEvent, useEffect, useRef } from 'react';

import { Flex, Input, InputRef, Typography } from 'antd';

import { useSafeState } from 'ahooks';

import IconFont from '@/components/ui/IconFont';
import { TaskBaseItem } from '@/types/apis/request';

import { PRE_TASK_NAME_MAP } from '../../constants';

interface Props {
  value: TaskBaseItem;
  onChange: (value: TaskBaseItem) => void;
}

const TaskHeader: FC<Props> = ({ value, onChange }) => {
  const scriptRef = useRef<InputRef>(null);
  const [edit, setEdit] = useSafeState(false);

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    setEdit(true);
  };

  useEffect(() => {
    if (edit) {
      scriptRef.current?.focus();
    }
  }, [edit]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      name: event.target.value,
    });
  };

  const handleBlur = () => {
    setEdit(false);
    if (!value?.name || !value?.name?.trim()) {
      onChange({
        ...value,
        name: PRE_TASK_NAME_MAP?.[value?.type] || '',
      });
    }
  };

  return (
    <Flex flex={1} style={{ height: 32 }} align="center">
      {edit ? (
        <Flex flex={1} onClick={(e) => e.stopPropagation()}>
          <Input
            size="small"
            ref={scriptRef}
            value={value?.name}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Flex>
      ) : (
        <Flex flex={1} align="center" gap={12}>
          <Typography.Text style={{maxWidth:400}} ellipsis>{value?.name}</Typography.Text>
          <IconFont type="icon-edit" onClick={handleEdit} />
        </Flex>
      )}
    </Flex>
  );
};

export default TaskHeader;
