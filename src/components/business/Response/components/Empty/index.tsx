import { useTranslation } from 'react-i18next';

import cn from 'classnames';

import Empty from '@/components/ui/Empty';
import IconFont from '@/components/ui/IconFont';

import { ResponseEmptyContainer } from './style';

type ResponseEmpty = {
  description?: string;
  maskMode?: boolean;
  wrapClassName?: string;
};

const ResponseEmpty = ({ description, maskMode = false, wrapClassName }: ResponseEmpty) => {
  const { t } = useTranslation();
  return (
    <ResponseEmptyContainer className={cn({ 'mask-mode': maskMode }, wrapClassName)} >
      <Empty
        className="response-empty-wrap"
        description={description || t('api.run.response_tip')}
        image={<IconFont type="icon-zanwu" className="icon-empty-wrap" />}
      />
    </ResponseEmptyContainer>
  );
};

export default ResponseEmpty;
