import { useTranslation } from 'react-i18next';

import { ConfigProvider, Flex, Input, Typography, message } from 'antd';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Tooltip from '@/components/ui/Tooltip';
import useTheme from '@/components/ui/theme';
import { copyStringToClipboard } from '@/utils/common';
import SvgHttp from '@/assets/icon/http.svg';

import { ExternalContainer } from './style';
import { ApiDetailsData } from '@/types/apis/api';
import { openUrl } from '@/utils/open';

const { Text } = Typography;

type ShareModalProps = {
  onCancel: () => void;
  shareInfo: {
    netUrl: string;
    apiName: string;
    apiData: ApiDetailsData | null
  }
}

const ShareModal = (props: ShareModalProps) => {
  const { onCancel, shareInfo } = props;

  const { t } = useTranslation();
  const { themeToken } = useTheme();

  const exportAsSwagger = async () => {
    window?.vscode.postMessage({
      action: 'exportOpenApiById',
      data: { target_id: shareInfo?.apiData?.target_id }
    });
  };

  const openLink = () => {
    openUrl(shareInfo.netUrl);
  }

  const footerRender = () => {
    return (
      <Flex gap={12} justify='flex-end'>
        <Button type="default" onClick={() => openLink()}>
          {t('docs.document.open_link')}
        </Button>
        <Button
          onClick={() =>
            copyStringToClipboard(shareInfo.netUrl, () =>
              message.success(t('supplement.clipboard_success'))
            )
          }
          type="primary"
        >
          {t('docs.document.copy_link')}
        </Button>


      </Flex>
    );
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelFontSize: themeToken.fontSize14,
            itemMarginBottom: themeToken.margin,
          },
        },
      }}
    >
      <Modal
        open
        title={t('docs.share_modal.title')}
        styles={{ body: { overflowX: 'auto' } }}
        onCancel={() => onCancel()}
        footer={footerRender()}
      >
        <Flex vertical gap={themeToken.margin}>
          <Flex align='center' gap={4}>
            <SvgHttp style={{ fontSize: '14px' }} />
            <Tooltip title={shareInfo.apiName}>
              <Typography.Text ellipsis style={{ flex: 1 }}>
                {shareInfo.apiName}
              </Typography.Text>
            </Tooltip>

          </Flex>
          <Flex gap={themeToken.margin}>
            <ExternalContainer>
              <Input
                prefix={
                  <div onClick={(e) => e?.stopPropagation()} className="external-tips">
                    {t('docs.share_modal.external_network')}
                  </div>
                }
                readOnly
                value={shareInfo.netUrl}
              />
            </ExternalContainer>
          </Flex>
        </Flex>
      </Modal>
    </ConfigProvider>
  );
};

export default ShareModal;
