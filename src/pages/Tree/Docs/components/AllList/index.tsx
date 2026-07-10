import { FC, Key, MouseEvent, memo } from 'react';

import { Flex } from 'antd';

import { useSafeState, useUpdateEffect } from 'ahooks';
import cn from 'classnames';
import { includes } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';

import { AllListContainer } from './style';

interface Props {
  onExpendedAll: (expended: boolean) => void;
  onPosition?: () => void;
  onRefresh?: () => void;
  onAllClick?: () => void;
  onHistoryClick?: () => void;
  selectedKeys?: Key[];
  AllListText: string;
  customFieldNames: {
    title?: string;
    key?: string;
    parentKey?: string;
    children?: string;
    type?: string;
    parentNodeType?: string;
  };
}

const AllList: FC<Props> = memo(
  ({
    onExpendedAll,
    onPosition,
    onRefresh,
    onAllClick,
    onHistoryClick,
    selectedKeys,
    AllListText,
    customFieldNames = {
      title: 'name',
      key: 'target_id',
      parentKey: 'parent_id',
      children: 'children',
      type: 'target_type',
      parentNodeType: APIS_TARGET_TYPE_ENUM.FOLDER,
    },
  }) => {
    const [isExpanded, setIsExpanded] = useSafeState(false);

    useUpdateEffect(() => {
      setIsExpanded(false);
    }, [projectId]);

    const handleAllExpand = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onExpendedAll(!isExpanded);
      if (isExpanded) {
        setIsExpanded(false);
        return;
      }

      setIsExpanded(true);
    };

    const handlePosition = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onPosition && onPosition();
    };

    const handleAllClick = () => {
      onAllClick?.();
    };

    const handleHistory = ()=>{
      onHistoryClick?.();
    };

    return (
      <div style={{ paddingRight: 10 }}>
        <AllListContainer
          onClick={handleAllClick}
          className={cn({ selected: includes(selectedKeys, 'all') })}
        >
          <Flex justify="space-between" align="center" style={{ height: '100%' }}>
            <Flex className="title-wrap" align="center" flex={1}>
              <IconFont type="icon-all-apis" />
              <span className="title">{AllListText}</span>
            </Flex>

            <Flex className="actions-wrap" align="center">
              <Tooltip title={'History'}>
                <IconFont type="icon-history" style={{ fontSize: 12 }} onClick={handleHistory} />
              </Tooltip>

              <Tooltip title={t('common.folder_operate.locate')}>
                <IconFont type="icon-positioning" onClick={handlePosition} />
              </Tooltip>
              <Tooltip
                title={
                  isExpanded
                    ? t('common.folder_operate.collapse')
                    : t('common.folder_operate.expand')
                }
              >
                <IconFont
                  type={isExpanded ? 'icon-folding' : 'icon-drill-down'}
                  onClick={handleAllExpand}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </AllListContainer>
      </div>
    );
  }
);

export default AllList;
