import React from 'react';
import { useTranslation } from 'react-i18next';

import IconFont from '@/components/ui/IconFont';

import { ResponseErrorContainer } from './style';
import { openUrl } from '@/utils/open';

interface ResponseErrorProps {
  errorMessage: string;
  onClose?: (string: 'none') => void;
}

const ResponseError: React.FC<ResponseErrorProps> = (props) => {
  const { t } = useTranslation();
  const { errorMessage, onClose } = props;

  // proxy error
  const isRenderErrorMessage = (message: string) => {
    return /connect ECONNREFUSED/.test(message);
  };

  const handleClose = () => {
    onClose?.('none');
  };

  return (
    <ResponseErrorContainer>
       {onClose && (
        <IconFont type="icon-error" className="close-error-wrapper" onClick={handleClose} />
      )}
      <div className="container">
        {t('supplement.intro_script')}
        <p className="error-str">{errorMessage}</p>
        {isRenderErrorMessage(errorMessage) && (
          <p className="error-str proxy-error">{t('supplement.proxy_sys_tip')}</p>
        )}
        <p className="err-desc-go-index">
          {t('supplement.go')}&nbsp;
          <span onClick={() => openUrl('https://www.echoapi.com/')}>https://www.echoapi.com/</span>
          &nbsp;{t('supplement.proxy_sys_tip1')}
        </p>
      </div>
    </ResponseErrorContainer>
  );
};

export default ResponseError;
