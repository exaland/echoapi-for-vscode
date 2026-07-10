import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import cn from 'classnames';

import Empty from '@/components/ui/Empty';
import IconFont from '@/components/ui/IconFont';
import { CLIENT_DOWNLOAD_URL } from '@/constants/common';
import { openUrl } from '@/utils/open';

import { ResponseEmptyContainer } from './style';

type ResponseEmpty = {
  description?: string;
  maskMode?: boolean;
};

const ResponseEmpty = ({ description, maskMode = false }: ResponseEmpty) => {
  const { t } = useTranslation();

  const defaultDescription = (
    <Flex gap={4} vertical>
      <span>{t('api.run.response_tip')}</span>
      <span>{t('api.run.response_tip_cors')}</span>
      <span>
        {t('api.run.response_tip_local')}
        <span className="empty-desc-download" onClick={() => openUrl(CLIENT_DOWNLOAD_URL)}>
          {t('api.run.response_tip_down')}
        </span>
      </span>
    </Flex>
  );

  return (
    <ResponseEmptyContainer className={cn({ 'mask-mode': maskMode })}>
      <Empty
        className="response-empty-wrap"
        description={description || defaultDescription}
        image={<IconFont type="icon-zanwu" className="icon-empty-wrap" />}
      />
    </ResponseEmptyContainer>
  );
};

export default ResponseEmpty;
