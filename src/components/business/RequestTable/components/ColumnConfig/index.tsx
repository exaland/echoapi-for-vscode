import { FC, memo, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Switch, Typography } from 'antd';

import { useSafeState } from 'ahooks';
import produce from 'immer';
import { includes, isBoolean, isEqual } from 'lodash';

import { Popover, Tooltip } from '@/components/ui';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import { STATUS_CODE } from '@/constants/common';
import { ChangeFuncType } from '@/types/common';

import { PARAMETER_TYPE, RequestTableProps, TableColumnSwitchConfig } from '../../types';

import { ColumnConfigContainer, DescMoreItemWrap } from './style';
import { useSystemConfig } from '@/store';

type Props = Pick<
  RequestTableProps,
  'tabType' | 'columnSwitchConfig' | 'onColumnSwitchConfig' | 'bodyMode'
> & {
  onAiModal: () => void;
  setParameterType: (parameterType: PARAMETER_TYPE) => void;
  setOpen: (open: boolean) => void;
};

const ColumnConfig: FC<Props> = memo(
  ({
    tabType,
    columnSwitchConfig,
    onColumnSwitchConfig,
    setParameterType,
    setOpen,
  }) => {
    const { t } = useTranslation();
    const [popoverOpen, setPopoverOpen] = useSafeState(false);
    const systemConfig = useSystemConfig(store => store.systemConfig);
    const updateSystemConfig = useSystemConfig(store => store.updateSystemConfig);

    const onColumnSwitchChange: ChangeFuncType<TableColumnSwitchConfig> = (key, value) => {
      const config = produce(columnSwitchConfig, (draft) => {
        if (draft?.[key]) {
          draft[key] = value;
        }
      });

      config && onColumnSwitchConfig?.(config);
    };

    const calcChecked = (checked: boolean) => {
      return checked ? STATUS_CODE.ENABLE : STATUS_CODE.DISABLE;
    };

    if (isEqual(tabType, 'event') || isEqual(tabType, 'socketio')) {
      return null;
    }

    const handleOperate = (key: PARAMETER_TYPE) => {
      setParameterType(key);
      setOpen(true);
      setPopoverOpen(false);
    };

    return (
      <ColumnConfigContainer>
        <Flex gap={8} align="center" style={{ height: '100%' }}>
          <Popover
            placement="bottomLeft"
            trigger={['click']}
            arrow={false}
            overlayInnerStyle={{ padding: '8px 12px', width: 228 }}
            open={popoverOpen}
            onOpenChange={(open) => setPopoverOpen(open)}
            content={
              <Flex vertical>
                <DescMoreItemWrap className="tips-item-wrap">
                  <span>{t('common.request_table.display_column')}</span>
                  <Tooltip title={t('common.request_table.display_column_tips')}>
                    <IconFont type="icon-tips" />
                  </Tooltip>
                </DescMoreItemWrap>
                <DescMoreItemWrap>
                  <span>{t('common.request_table.display_column_param_type')}</span>
                  <Switch
                    size="small"
                    checked={isEqual(columnSwitchConfig?.parameter_type, STATUS_CODE.ENABLE)}
                    onChange={(checked) =>
                      onColumnSwitchChange('parameter_type', calcChecked(checked))
                    }
                  />
                </DescMoreItemWrap>
                <DescMoreItemWrap>
                  <span>{t('common.request_table.display_column_param_desc')}</span>
                  <Switch
                    size="small"
                    checked={isEqual(columnSwitchConfig?.parameter_description, STATUS_CODE.ENABLE)}
                    onChange={(checked) =>
                      onColumnSwitchChange('parameter_description', calcChecked(checked))
                    }
                  />
                </DescMoreItemWrap>
              </Flex>
            }
          >
            <Tooltip overlayClassName='raw-parameter-pilot-bubble-tooltip' placement='bottomRight' open={isBoolean(systemConfig?.raw_parameter_pilot_bubble_switch) ? systemConfig?.raw_parameter_pilot_bubble_switch : false} title={<Flex vertical gap={12} style={{ padding: 10 }}>
              <Typography.Text style={{ color: 'var(--font-title-color)', fontSize: '14px' }}>
                Parameter types/requirements and descriptions are hidden by default in '...'. Click '...' to toggle their visibility.
              </Typography.Text>
              <Flex gap={2} vertical style={{"padding": 12,"backgroundColor": "var(--color-bg-page)",fontSize: 14}}>
                <Flex gap={8}>
                  <Typography.Text style={{ color: 'var(--font-light-color)', fontSize: '12px' }}>
                    Display Column
                  </Typography.Text>
                  <IconFont type='icon-wenhao' />
                </Flex>
                <Flex style={{ padding: '6.5px 0' }} justify='space-between'>
                  <Typography.Text style={{ color: 'var(--font-light-color)', fontSize: '14px' }}>
                    Parameter Type / Required
                  </Typography.Text>
                  <Switch checked={false} disabled={true} />
                </Flex>
                <Flex style={{ padding: '6.5px 0' }} justify='space-between'>
                  <Typography.Text style={{ color: 'var(--font-light-color)', fontSize: '14px' }}>
                  Parameter Description
                  </Typography.Text>
                  <Switch checked={false} disabled={true} />
                </Flex>
              </Flex>
              <Flex justify='end'>
                <Button type='primary' onClick={() => {
                  updateSystemConfig({ ...systemConfig, raw_parameter_pilot_bubble_switch: false });
                  window?.vscode.postMessage({
                    action: 'setSystemConfig',
                    data: { raw_parameter_pilot_bubble_switch: false }
                  });
                }}>Confirm</Button>
              </Flex>
            </Flex>}>
              <IconFont className='icon-navi-more' type="icon-navi-more" />
            </Tooltip>
          </Popover>
          <Button
            type="text"
            size="small"
            style={{ justifyContent: 'flex-start', paddingInline: 0 }}
            onClick={() => handleOperate(PARAMETER_TYPE.BATCH_EDIT)}
          >
            {t('common.request_table.batch_edit')}
          </Button>
        </Flex>
      </ColumnConfigContainer>
    );
  }
);

export default ColumnConfig;
