import { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Empty as AntEmpty } from 'antd';
import type { EmptyProps } from 'antd';

import EmptyIcon from '@/assets/icon/empty.svg?react';

import { EmptyWrap } from './style';
import { openUrl } from '@/utils/open';

type Props = EmptyProps & {
  wrapClassName?: string;
  wrapStyle?: CSSProperties;
  link?: string;
};

const Empty: FC<Props> = ({ wrapClassName, wrapStyle, children, ...resetProps }) => {
  const { t } = useTranslation();
  const image = resetProps.image || <EmptyIcon />;
  const description = resetProps.description || t('common.nodata');
  const link = resetProps.link || '';

  return (
    <EmptyWrap className={wrapClassName} style={wrapStyle}>
      <AntEmpty {...resetProps} image={image} description={description}>
        {children}
        {link && <a onClick={() => openUrl(link)}>{t('supplement.doc_use')}</a>}
      </AntEmpty>
    </EmptyWrap>
  );
};

export default Empty;
