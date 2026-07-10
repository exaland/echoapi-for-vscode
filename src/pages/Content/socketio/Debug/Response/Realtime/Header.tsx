import { useTranslation } from 'react-i18next';

import { Flex, Input, Select } from 'antd';

import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import useWebsocket2Store from '@/store/useApis/websocket2';

interface Props {
  filterValue: string;
  setFilterValue: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  target_id: string;
}
const Header = (props: Props) => {
  const { t } = useTranslation();
  const { filterValue, setFilterValue, filterType, setFilterType, target_id } = props || {};
  const websocket2ConnectionPool = useWebsocket2Store((state) => state.websocket2ConnectionPool);
  const updateWebsocket2ConnectionPool = useWebsocket2Store(
    (state) => state.updateWebsocket2ConnectionPool
  );

  return (
    <>
      <Flex justify="space-between" className="ws-header">
        <Flex align="center" gap={8} style={{ wordBreak: 'keep-all' }}>
          <Input
            prefix={<IconFont type="icon-search-line" className="icon-color" />}
            placeholder={t('ws.response.search_tip')}
            value={filterValue}
            onChange={(e) => setFilterValue(e?.target?.value || '')}
            size="small"
          />
          <Select
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
            value={filterType}
            onChange={setFilterType}
            size="small"
          >
            <Select.Option value="all">{t('ws.response.all_message')}</Select.Option>
            <Select.Option value="send">{t('ws.response.sent')}</Select.Option>
            <Select.Option value="message">{t('ws.response.received')}</Select.Option>
          </Select>
          <Button
            style={{ height: 32,borderColor:'var(--color-table-border)' }}
            size="small"
            icon={<IconFont type="icon-delete" />}
            onClick={() =>
              updateWebsocket2ConnectionPool({
                ...websocket2ConnectionPool,
                [target_id]: { ...websocket2ConnectionPool[target_id], socketRes: [] },
              })
            }
          >
            {t('ws.response.clear')}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
