import { useTranslation } from 'react-i18next';

import Empty from '@/components/ui/Empty';

import { RequestBodyContentContainer } from '../../style';

const RequestBodyNone = () => {
  const { t } = useTranslation();
  return (
    <RequestBodyContentContainer>
      <Empty description={t('common.nodata')} />
    </RequestBodyContentContainer>
  );
};

export default RequestBodyNone;
