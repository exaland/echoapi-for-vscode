import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@/components/ui/Button';

import { ResponseSendContainer } from './style';
import { useApis } from '@/store';

interface SendingProps {
  hasCancel?: boolean;
  onlySendingLoadingBar?: boolean;
  onCancel?: () => void;
}

const Sending: React.FC<SendingProps> = ({
  onlySendingLoadingBar = false,
  hasCancel = true,
  onCancel,
}) => {
  const { t } = useTranslation();
  const updateCurrentSendingData = useApis(store => store.updateCurrentSendingData);
  const handleCancel = () => {
    updateCurrentSendingData({ sendStatus: 'initial' });

    // Terminate the sending thread
    window?.vscode.postMessage({
      action: 'stopSendApi',
    });

    onCancel?.();
  };

  return (
    <ResponseSendContainer style={{ ...(onlySendingLoadingBar ? { height: 2 } : {}) }}>
      <div className="sending-loading-bar" />
      {!onlySendingLoadingBar && (
        <div className="sending-loading-content">
          <div className="sending-loading-content-text">{t('supplement.sending')}</div>
          {hasCancel && (
            <Button type="primary" mode="light" onClick={handleCancel}>
              {t('supplement.cancel_send')}
            </Button>
          )}
        </div>
      )}
    </ResponseSendContainer>
  );
};

export default Sending;
