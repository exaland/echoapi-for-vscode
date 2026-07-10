import { FC, ReactNode, memo, useMemo } from 'react';

import { Dropdown, MenuProps } from 'antd';

import { isFunction, isNumber } from 'lodash';

import { TreeDataItem } from '@/types/apis/api';

import { ItemTitleContainer } from '../style';

type Props = Partial<
  TreeDataItem & {
    showChildrenCount?: boolean;
    scrollIng?: boolean;
    childrenCount?: number;
    nodeItemTitleExtraContent: (item: Props) => ReactNode;
    nodeItemDropdownContextMenu: any;
    onClick?:any;
  }
>;

const ItemTitle: FC<Props> = memo((props) => {
  const {
    name,
    showChildrenCount,
    nodeItemTitleExtraContent,
    nodeItemDropdownContextMenu,
    scrollIng,
    childrenCount,
    onClick
  } = props;

  const dropdownContextMenu = useMemo(
    () => (!scrollIng ? nodeItemDropdownContextMenu?.(props) : undefined),
    [nodeItemDropdownContextMenu, props, scrollIng]
  );

  const extraContent = useMemo(
    () => nodeItemTitleExtraContent?.({ ...props, moreOperateMenu: dropdownContextMenu }),
    [nodeItemTitleExtraContent, props, dropdownContextMenu]
  );

  const renderContent = (
    <ItemTitleContainer>
      <div onClick={()=>{
        if(isFunction(onClick)){
          onClick();
        }
      }} className="title" title={name}>
        {name}
        {showChildrenCount && isNumber(childrenCount) && childrenCount > 0 && (
          <span className="children-num">({childrenCount})</span>
        )}
      </div>
      {extraContent}
    </ItemTitleContainer>
  );

  if (props?.scrollIng) {
    return renderContent;
  }

  if (!dropdownContextMenu) {
    return renderContent;
  }

  return (
    <Dropdown 
    trigger={['contextMenu']} 
    menu={dropdownContextMenu}>
      {renderContent}
    </Dropdown>
  );
});

export default ItemTitle;
