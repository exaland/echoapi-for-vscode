import React from 'react';
import TeamProjectManage from '@/components/ui/TeamProjectManage';
import SvgUpload from '@/assets/icon/upload.svg?react';
import SvgPull from '@/assets/icon/pull.svg?react';
import { TreeMenuHeaderWarp } from './style';
import { Flex, message, Tooltip } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { useUserConfig } from '@/store';
import { Button } from '@/components/ui';
import { useTranslation } from 'react-i18next';

const TreeMenuHeader = (props: { handlePull: () => void }) => {
  const { handlePull } = props;
  const { t } = useTranslation();

  const token = useUserConfig(store => store.token)
  const { currentProject, currentTeam } = useUserConfig(
    useShallow(({ currentProject, currentTeam }) => {
      return {
        currentProject,
        currentTeam
      };
    })
  );

  function handleUpload(): void {
    if (!token) {
      message.error(
        <>
          <p style={{ textAlign: 'left' }}> {t('common.please')}:</p>
          <p style={{ textAlign: 'left' }}> 1. {t('own.sign_cloud_account')}</p>
          <p style={{ textAlign: 'left' }}> {t('own.push_tip')}</p>
        </>
      );
      // Open login tab
      window?.vscode.postMessage({
        action: 'openLogin',
      });
      return;
    }
    // Open push tab
    window?.vscode.postMessage({
      action: 'openPushPanel',
    });
  }

  return (
    <TreeMenuHeaderWarp>
      <TeamProjectManage currentProject={currentProject} currentTeam={currentTeam} />
      <Flex gap={8}>
        {!token ? <Button style={{fontSize: 12,paddingRight: 8,fontWeight: 600}} mode="light" type='text' onClick={() => {
          // Open login tab
          window?.vscode.postMessage({
            action: 'openLogin',
          });
        }}>Team Up</Button> : <>
          <Tooltip title={t('supplement.push')} placement="bottomRight">
            <div className="upload" onClick={() => handleUpload()}><SvgUpload /></div>
          </Tooltip>
          <Tooltip title={t('supplement.pull')} placement="bottomRight">
            <div className="pull" onClick={() => handlePull()}><SvgPull /></div>
          </Tooltip>
        </>}
      </Flex>
    </TreeMenuHeaderWarp>
  );
};

export default TreeMenuHeader;
