import { FC, memo } from 'react';

import { Dropdown, Flex, MenuProps } from 'antd';

import { useMemoizedFn } from 'ahooks';
import { includes } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import { APIS_TARGET_TYPE_ENUM } from '@/constants/apis';
import { createOpensItem } from '@/events/apis/opens';
import { ApisBaseData } from '@/types/apis/base';


import { CreateOtherIcon } from './style';

interface Props {
  nodeItem: ApisBaseData & {
    scrollIng: boolean;
    moreOperateMenu: MenuProps;
  };
}

const TitleExtraContent: FC<Partial<Props>> = memo(({ nodeItem }) => {
  const handleFolderAddClick = useMemoizedFn(
    async (nodeItem: ApisBaseData | undefined, key: APIS_TARGET_TYPE_ENUM) => {
      const result = await createOpensItem({
        target_type: key as APIS_TARGET_TYPE_ENUM,
        project_id: '',
        parent_id: nodeItem?.target_id || '0'
      });
      if (['api','sse'].includes(key)) {
        window?.vscode.postMessage({
          action: 'openTagPanel',
          data: result
        });
      }
      if (key === 'folder') {
        window?.vscode.postMessage({
          action: 'showInputBox',
          data:{
            type:'folder',
            sourceData:result,
          }
        });
      }
    }
  );

  const handleStopPropagation = useMemoizedFn((event: MouseEvent<HTMLDivElement>) => {
    event?.stopPropagation();
  });

  return (
    <div className="apis-tree-title-extra-content-container" onClick={handleStopPropagation}>
      <Flex gap={8} align="center" className="tree-node-item-title-action-wrap">
        {!includes(
          [APIS_TARGET_TYPE_ENUM.FOLDER, APIS_TARGET_TYPE_ENUM.SOCKET],
          nodeItem?.target_type
        ) && (
          <>
          </>
        )}
        {!nodeItem?.scrollIng && (
          <div className="more-operate-wrap">
            <Dropdown trigger={['click']} menu={nodeItem?.moreOperateMenu}>
              <IconFont type="icon-navi-more" className="more-operate" />
            </Dropdown>
          </div>
        )}
      </Flex>
    </div>
  );
});

export default TitleExtraContent;
