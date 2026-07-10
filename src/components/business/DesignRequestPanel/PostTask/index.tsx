import { FC, FunctionComponent, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useMemoizedFn, useSafeState } from 'ahooks';
import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { filter, find, findIndex, isEqual, map } from 'lodash';

import { SCRIPT_TYPE } from '@/components/business/CustomScript/constants';
import SortableCollapse from '@/components/business/SortableCollapse';
import { DRAG_MODE } from '@/components/business/SortableCollapse/types';
import { Tooltip } from '@/components/ui';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import Popover from '@/components/ui/Popover';
import { APIS_TASK_TYPES_ENUM } from '@/constants/apis';
import { STATUS_CODE } from '@/constants/common';
import useTheme from '@/hooks/useTheme';
import { ApiRequest, TaskBaseItem } from '@/types/apis/request';
import { ChangeFuncType } from '@/types/common';
import { openUrl } from '@/utils/open';

import AssertContent from '../TaskComponents/Assert';
import CustomScriptContent from '../TaskComponents/CustomScript';
import PickVarContent from '../TaskComponents/PickVars';
import TaskHeader from '../TaskComponents/TaskHeader';
import Wait from '../TaskComponents/Wait';
import { DEFAULT_DATA, POST_TASK_ADD_MENUS_LIST } from '../constants';

import { RequestPostTaskContainer } from './style';
import { ApiDetailsData } from '@/types/apis/api';

interface Props {
  apiData?: ApiDetailsData;
  onlyAssert?: boolean;
  value: ApiRequest['post_tasks'];
  onChange: ChangeFuncType<ApiRequest>;
}

const TASK_CONTENT_MAP: {
  [key: string]: FunctionComponent<{
    apiData?: ApiDetailsData;
    mode: SCRIPT_TYPE;
    value: TaskBaseItem;
    onChange: (value: TaskBaseItem) => void;
  }>;
} = {
  [APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT]: CustomScriptContent,
  [APIS_TASK_TYPES_ENUM.PICK_VARS]: PickVarContent,
  [APIS_TASK_TYPES_ENUM.ASSERT]: AssertContent,
} as const;

const RequestPostTask: FC<Props> = memo(
  ({ apiData, onlyAssert, value, onChange }) => {
    const { t } = useTranslation();
    const { themeToken } = useTheme();
    const [popoverOpen, setPopoverOpen] = useSafeState(false);

    const renderPopoverContent = map(
      filter(POST_TASK_ADD_MENUS_LIST, (it) =>
        onlyAssert ? it?.key === APIS_TASK_TYPES_ENUM.ASSERT : true
      ),
      (item) => {
        return (
          <Button
            block
            type="text"
            mode="menu-item"
            style={{ width: 200, justifyContent: 'flex-start' }}
            icon={<IconFont style={{ color: item.color }} type={item.icon} />}
            key={item.key}
            onClick={() => handleAdd(item.key)}
          >
            <Flex justify="space-between" style={{ display: 'flex', width: '100%' }}>
              {item.name}
              {item?.tips && (
                <Tooltip
                  title={
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        openUrl(item.link);
                      }}
                    >
                      {item.tips}
                    </span>
                  }
                >
                  <IconFont
                    type="icon-tips"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUrl(item.link);
                    }}
                  />
                </Tooltip>
              )}
            </Flex>
          </Button>
        );
      }
    );

    const handleAdd = async (key: APIS_TASK_TYPES_ENUM) => {
      try {
        if ([APIS_TASK_TYPES_ENUM.DATABASE].includes(key)) {
          // await guestValidate();
        }

        const newRequestData = produce(value, (draft) => {
          draft?.push({
            ...DEFAULT_DATA[key],
            id: snowflakeId(),
          });
        });

        onChange('post_tasks', newRequestData);
      } catch (err) {
        // err
      } finally {
        setPopoverOpen(false);
      }
    };

    const handleTaskItemChange = useMemoizedFn((index: number, newValue: TaskBaseItem) => {
      const newRequestData = produce(value, (draft) => {
        draft![index] = newValue;
      });

      onChange('post_tasks', newRequestData);
    });

    const handleOpenChange = (newOpen: boolean) => {
      setPopoverOpen(newOpen);
    };

    const renderCustomHeader = useMemoizedFn((item: TaskBaseItem) => {
      const currentIndex = findIndex(value, (findItem: TaskBaseItem) =>
        isEqual(item.id, findItem?.id)
      );

      if (item.type === APIS_TASK_TYPES_ENUM.WAIT) {
        return (
          <Wait
            value={item}
            onChange={(value: TaskBaseItem) => handleTaskItemChange(currentIndex, value)}
          />
        );
      }

      return (
        <TaskHeader
          value={item}
          onChange={(value: TaskBaseItem) => handleTaskItemChange(currentIndex, value)}
        />
      );
    });

    const renderCustomContent = useMemoizedFn((item: TaskBaseItem) => {
      if (item.type === APIS_TASK_TYPES_ENUM.WAIT) {
        return null;
      }

      const Component = TASK_CONTENT_MAP[item.type];
      const currentIndex = findIndex(value, (findItem: TaskBaseItem) =>
        isEqual(item.id, findItem?.id)
      );

      return (
        <Component
          apiData={apiData}
          value={item}
          mode={SCRIPT_TYPE.ASSERT}
          onChange={(value: TaskBaseItem) => handleTaskItemChange(currentIndex, value)}
        />
      );
    });

    const onSwitchChange = useMemoizedFn((checked: boolean, record: TaskBaseItem) => {
      const newRequestData = produce(value, (draft) => {
        const currentIndex = findIndex(value, (findItem: TaskBaseItem) =>
          isEqual(record.id, findItem?.id)
        );
        draft![currentIndex] = {
          ...record,
          enabled: checked ? STATUS_CODE.ENABLE : STATUS_CODE.DISABLE,
        };
      });

      onChange('post_tasks', newRequestData);
    });

    const onDelete = useMemoizedFn((item: TaskBaseItem) => {
      const newRequestData = produce(value, (draft) => {
        const currentIndex = findIndex(value, (findItem: TaskBaseItem) =>
          isEqual(item.id, findItem?.id)
        );
        draft?.splice(currentIndex, 1);
      });

      onChange('post_tasks', newRequestData);
    });

    const handleDragEnd = useMemoizedFn(
      (currentKey: string, targetKey: string, mode: DRAG_MODE) => {
        if (isEqual(currentKey, targetKey)) return;

        const current = find(value, (item) => item.id === currentKey);
        const target = find(value, (item) => item.id === targetKey);

        if (!current || !target) return;

        const newRequestData = produce(value, (draft) => {
          const currentIdx = findIndex(value, (findItem) => isEqual(findItem?.id, current?.id));
          const targetIdx = findIndex(value, (findItem) => isEqual(findItem?.id, target?.id));

          if ([DRAG_MODE.TOP, DRAG_MODE.BOTTOM].includes(mode)) {
            draft?.splice(currentIdx, 1);
          }

          if (mode === DRAG_MODE.TOP) {
            draft?.splice(targetIdx, 0, current);
          }

          if (mode === DRAG_MODE.BOTTOM) {
            draft?.splice(targetIdx + 1, 0, current);
          }
        });

        onChange('post_tasks', newRequestData);
      }
    );

    return (
      <RequestPostTaskContainer>
        <SortableCollapse
          rowKey="id"
          isTree={false}
          showOrderNumber={false}
          notChildren={[APIS_TASK_TYPES_ENUM.WAIT]}
          isDefaultActiveItems={[
            APIS_TASK_TYPES_ENUM.ASSERT,
            APIS_TASK_TYPES_ENUM.CUSTOM_SCRIPT,
            APIS_TASK_TYPES_ENUM.DATABASE,
            APIS_TASK_TYPES_ENUM.PICK_VARS,
          ]}
          sortItemList={value || []}
          customHeader={renderCustomHeader}
          customContent={renderCustomContent}
          handleDragEnd={handleDragEnd}
          defaultTools={{
            switchKey: 'enabled',
            onSwitchChange,
            onDelete,
          }}
        />
        <Popover
          content={renderPopoverContent}
          trigger="click"
          placement="bottom"
          overlayInnerStyle={{ padding: themeToken.padding8 }}
          open={popoverOpen}
          onOpenChange={handleOpenChange}
        >
          <Button size="large" icon={<IconFont type="icon-add-line" />} type="dashed">
            {t('common.add')}
          </Button>
        </Popover>
      </RequestPostTaskContainer>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RequestPostTask;
