import { IconFont } from '@/components/ui';
import { Dropdown, Flex, MenuProps } from 'antd';
import i18next from 'i18next';
import { find } from 'lodash';
import { NewBtnsContainer } from './style';
import React from 'react';

type NewProps = {
  createMenus?: MenuProps['items'];
}

 const NewBtns=({createMenus}:NewProps)=> {
  return (
    <NewBtnsContainer>
        <Dropdown.Button
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          menu={{ items: createMenus }}
          placement="bottomRight"
          trigger={['click']}
          type="primary"
          size='small'
          className='beautify-new-http-more'
          icon={<IconFont type="icon-drop-down" />}
          onClick={() => {
            const apiMenu = find(createMenus,(im)=>im?.key === 'api');
            apiMenu && (apiMenu as any)?.onClick({ key:'api' });
          }}
        >
          {i18next.t('common.folder_operate.new_http_request')}
        </Dropdown.Button>
      </NewBtnsContainer>
  )
};

export default NewBtns;
