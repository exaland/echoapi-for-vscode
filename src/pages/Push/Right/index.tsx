import React, { useMemo, useState } from 'react';
import { PushRightWrap } from './style';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import TeamProjectManage from '@/components/ui/TeamProjectManage';
import { Button, Flex } from 'antd';
import { useUserConfig } from '@/store';
import { Project, TeamItem } from '@/types/user';
import { getTeamAndProjectByProjectId } from '@/events/project';
import ApiConflict from './ApiConflict';
import { PushApiData, PushEnvData } from '../type';
import { isArray } from 'lodash';
import EnvConflict from './EnvConflict';

type PushRightProps = {
  handlePush: any;
  handleFix: any;
  pushApiData: Partial<PushApiData>;
  updatePushApiData: (key: string, val: any) => void;
  pushEnvData: Partial<PushEnvData>;
  updatePushEnvData: (key: string, val: any) => void;
  tabValue: 'apis' | 'env';
  handlePushCancel:()=>void;
}

const PushRight = (props: PushRightProps) => {
  const { tabValue,
    handlePush, handleFix,
    pushApiData, updatePushApiData,
    pushEnvData, updatePushEnvData,
    handlePushCancel
  } = props;
  const { t } = useTranslation();

  const teamProjectList = useUserConfig(stroe => stroe.teamProjectList);
  const { currentProject, currentTeam, updateCurrentTeam, updateCurrentProject } = useUserConfig(
    useShallow(({ currentProject, currentTeam, updateCurrentTeam, updateCurrentProject }) => {
      return {
        currentProject,
        currentTeam,
        updateCurrentTeam,
        updateCurrentProject
      };
    })
  );

  const onProjectChange = (project_id: string) => {
    const { team, project } =
      getTeamAndProjectByProjectId({ projectId: project_id, teamProjectList }) || {};
    if (team && project) {

      // Switch to selected target project
      updateCurrentTeam(team);
      updateCurrentProject(project);

    }
  };

  const dynamicStyle = useMemo(() => {
    if ((isArray(pushApiData?.conflictItems) && pushApiData.conflictItems.length > 0) ||
      isArray(pushEnvData?.conflictItems) && pushEnvData.conflictItems.length > 0) {
      return {
        marginTop: '129px',
        backgroundColor: 'transparent',
        paddingTop:'0'
      }
    }
    return {};
  }, [pushApiData?.conflictItems,pushEnvData?.conflictItems]);

  const renderConfictItems = () => {
    if (tabValue === 'apis' && isArray(pushApiData?.conflictItems) && pushApiData.conflictItems.length > 0) {
      return <ApiConflict
        handleFix={handleFix}
        pushApiData={pushApiData}
        updatePushApiData={updatePushApiData}
        handlePushCancel={handlePushCancel}
      />;
    }
    if (tabValue === 'env' && isArray(pushEnvData?.conflictItems) && pushEnvData.conflictItems.length > 0) {
      return <EnvConflict  handlePushCancel={handlePushCancel} pushEnvData={pushEnvData} updatePushEnvData={updatePushEnvData} handleFix={handleFix} />;
    }
    return <>
      <label>{t('common.push_target_address')}</label>
      <TeamProjectManage from='push' currentProject={currentProject?.project_id === '-1' ? {} as Project : currentProject} currentTeam={currentTeam?.team_id === '-1' ? {} as TeamItem : currentTeam} onProjectChange={onProjectChange} />

      <Flex justify='end'>
        <Button type="primary" onClick={handlePush}>
          {`${t('common.push')}(${(pushApiData?.checkedKeys?.length || 0) + (pushEnvData?.checkedKeys?.length || 0)} ${t('common.selected')})`}
        </Button>
      </Flex>
    </>;
  };

  const renderTitle = ()=>{
    if (tabValue === 'apis' && isArray(pushApiData?.conflictItems) && pushApiData.conflictItems.length > 0){
      return t('common.api_folder_conflict_handling');
    }else if(tabValue === 'env' && isArray(pushEnvData?.conflictItems) && pushEnvData.conflictItems.length > 0){
      return t('common.env_conflict_handling');
    }else{
      return t('common.push_to_echoapi');
    }
  };

  return (<PushRightWrap style={dynamicStyle}>
    <div className="title">
      {renderTitle()}
    </div>
    {renderConfictItems()}
  </PushRightWrap>
  );
};
export default PushRight;
