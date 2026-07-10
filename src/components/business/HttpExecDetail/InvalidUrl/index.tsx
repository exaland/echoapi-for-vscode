import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import IconFont from '@/components/ui/IconFont';

import { InvalidUrlWrapper } from './style';

type InvalidUrlProps = {
  url: string;
};

export const InvalidUrl = ({ url }: InvalidUrlProps) => {
  const { t } = useTranslation();
  return (
    <InvalidUrlWrapper vertical gap={12} align="center" justify="center">
      <IconFont className="icon" type="icon-qingqiucuowu" />
      <Typography.Text className="text">
        {t('supplement.invalid_url')} {url}
      </Typography.Text>
    </InvalidUrlWrapper>
  );
};
