import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Flex, Space, Switch, SwitchProps } from 'antd';

import produce from 'immer';
import { isArray } from 'lodash';

import IconFont from '@/components/ui/IconFont';
import Tooltip from '@/components/ui/Tooltip';
import { useSystemConfig, useProjectConfig } from '@/store';

import AddDomain from './components/AddDomain';
import DomainItem from './components/DomainItem';
import { DomainInfoProps, ICookie } from './types';

import CookieContainer from './style';
import { useSafeState } from 'ahooks';
import { INIT_DOMAIN_INFO } from '@/constants/project';
import { saveProjectConfig } from '@/events/apis/env';


const Index = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();

  const domainInfo = useProjectConfig((state) => state.cookie);
  const updateProjectConfig = useProjectConfig((state) => state.updateCookie);
  

  const updateDomainInfo = (domainInfo: any) => {
    updateProjectConfig(domainInfo);
    saveProjectConfig('cookie',domainInfo);
  };
  const systemConfig = useSystemConfig((state) => state.systemConfig);
  const updateSystemConfig = useSystemConfig((state) => state.updateSystemConfig);
  const [loading, setLoading] = useState(false);

  const switchChange: SwitchProps['onChange'] = async (v) => {
    setLoading(true);
    try {
      const global_cookie_open = v ? 1 : -1;

      window?.vscode.postMessage({
        action: 'setSystemConfig',
        data: {global_cookie_open }
      });

      updateSystemConfig({ ...systemConfig, global_cookie_open });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDomain = (type: string, val: any) => {
    const newVal = produce(domainInfo, (draft: any) => {
      draft[type] = val;
    });
    updateDomainInfo(newVal);
  };

  useEffect(() => {
    const { activeId, cookieObj, isShowArea } = domainInfo;
    if (!activeId) return;
    if (!isArray(cookieObj[isShowArea])) {
      return;
    }
    const arr = cookieObj[isShowArea].filter((t: ICookie) => t.cookie_id === activeId);
    if (arr.length === 0) return;
    let cookieString = `${arr[0].key}=${arr[0].value};Path=${arr[0].path};Domain=${arr[0].domain};`;
    if (arr[0].expires) {
      cookieString = `${cookieString}Expires=${arr[0].expires}`;
    }
    handleChangeDomain('cookieText', cookieString);
  }, [domainInfo?.activeId]);

  return (
    <CookieContainer>
      <Flex className="cookie-flex" vertical gap={15}>
        <div className="cookie-title">
          <Space className="title">
            {t('global_setting.cookie_detail.title')}
            <Tooltip title={t('global_setting.cookie_detail.tips')}>
              <IconFont type="icon-wenhao" />
            </Tooltip>
            <Switch
              size="small"
              loading={loading}
              checked={systemConfig?.global_cookie_open === 1}
              onChange={switchChange}
            />
          </Space>
        </div>
        <AddDomain project_id={projectId} value={domainInfo} onChange={updateDomainInfo} />
        <div className="cookie-content">
          <DomainItem project_id={projectId} value={domainInfo} onChange={updateDomainInfo} />
        </div>
      </Flex>
    </CookieContainer>
  );
};

export default Index;
