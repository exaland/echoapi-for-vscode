import React from 'react';
import { useTranslation } from 'react-i18next';

import { Space } from 'antd';

import { isArray } from 'lodash';

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import IconFont from '@/components/ui/IconFont';
import { ApiSendingData } from '@/types/apis/send';

import { ResponseAssertItemContainer } from '../style';

interface ListProps {
  asserts?: ApiSendingData['asserts'];
}

const List: React.FC<ListProps> = ({ asserts }) => {
  const { t } = useTranslation();
  return (
    <>
      {isArray(asserts) && asserts.length > 0 && (
        <>
          <div className="content-title">{t('common.assertion.tag')}</div>
          <div className="assert-list">
            {asserts?.map((item, index) => (
              <ResponseAssertItemContainer
                key={index}
                $status={!!item?.passed}
                className="content-item"
              >
                <Space>
                  {item?.passed ? <CheckCircleFilled /> : <CloseCircleFilled />}
                  <span>
                    {item?.passed ? item?.name : `${item?.name}: ${item?.error?.message}`}
                  </span>
                </Space>
              </ResponseAssertItemContainer>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default List;
