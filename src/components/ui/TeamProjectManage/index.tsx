import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, Space } from 'antd';

import { useThrottle } from 'ahooks';
import { useShallow } from 'zustand/react/shallow';

import IconFont from '@/components/ui/IconFont';
import Popover from '@/components/ui/Popover';
import { fetchTeamProjectList } from '@/events/user';
import useTheme from '@/hooks/useTheme';
import { useApis, useUserConfig } from '@/store';

import TeamMenu from './TeamMenu';

import { ProjectContainer, TeamWrapper } from './style';
import { DEFAULT_TEAM_PROJECT } from '@/constants/project';
import { userLogoutService } from '@/sevices/user';
import { Project, TeamItem } from '@/types/user';

const TeamProjectManage = (props: { currentTeam: TeamItem; currentProject: Project; onProjectChange?: any, from?: string }) => {
  const { currentTeam, currentProject, from, onProjectChange } = props;
  const { themeToken } = useTheme();
  const { t } = useTranslation();
  const { teamProjectList, token, updateToken, updateTeamProjectList } = useUserConfig(
    useShallow(({ teamProjectList, token, updateToken, updateTeamProjectList }) => {
      return {
        teamProjectList,
        token,
        updateToken,
        updateTeamProjectList
      };
    })
  );

  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const throttledSearchValue = useThrottle(searchValue, { wait: 300 });

  const onSearchProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };

  const signBtnClick = async () => {
    if (token) {
      // logout
      // notify main program to clear opened tabs, clear local token storage, and switch to local project
      window?.vscode.postMessage({
        action: 'userSingOut',
      });
      try {
        // call API
        await userLogoutService();
      } catch (error) { }
      // clear user team project list
      updateTeamProjectList([]);
      // clear token
      updateToken('');

      // close project list
      setIsOpen(false);
    } else {
      // open login page
      window?.vscode.postMessage({
        action: 'openLogin',
      });
      // close project list
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchTeamProjectList();
    }
  }, [isOpen]);

  const renderPopoverContent = () => {
    return (
      <ProjectContainer>
        <Flex vertical gap={12} style={{ width: '100%' }}>
          <div className="header">
            <Flex justify="space-between" align="center">
              <div className="header-left">{t('header.switch.team_project')}</div>
              <div className="header-right">

              </div>
            </Flex>
          </div>
          <div className="search">
            <Input
              className="search-input-wrap"
              style={{ height: 32 }}
              value={searchValue}
              onChange={onSearchProject}
              prefix={
                <IconFont type="icon-search-line" style={{ fontSize: themeToken.fontSize14 }} />
              }
              placeholder={t('header.switch.search')}
            />
          </div>

          <TeamMenu
            searchValue={throttledSearchValue}
            teamProjectList={from !== 'push' ? [{ ...DEFAULT_TEAM_PROJECT }, ...teamProjectList] : teamProjectList}
            setIsOpen={setIsOpen}
            handleMenuChange={onProjectChange}
          />
          {from !== 'push' && <Flex align='center' gap={4} justify='center'>
            <div className="sign-btn" onClick={() => signBtnClick()}>{token ? t('own.sign_out') : t('own.sign_in')} </div>
          </Flex>}

        </Flex>
      </ProjectContainer>
    );
  };

  return (
    <TeamWrapper>
      <Space className='team-project-manage-space'>
        <Popover
          open={isOpen}
          placement="bottomLeft"
          content={renderPopoverContent}
          overlayInnerStyle={{ padding: '16px 0' }}
          onOpenChange={handleOpenChange}
          trigger="click"
          overlayClassName='team-project-manage-popover'
        >
          <>
            <Flex justify='space-between'>
              <Space>
                {currentProject?.name ?
                  <>
                    <div className="team-name">{currentTeam?.name || t('supplement.no_team')} </div>
                    <span style={{ color: themeToken.fontLightColor }}>/</span>
                    <div className="project-name">
                      {currentProject?.name || t('supplement.no_project')}
                    </div>
                  </>
                  :
                  <>
                    <div className="no-select-project">{t('common.select_tip')}</div>
                  </>
                }
              </Space>
              <div className="project-icon">
                      <IconFont
                        type="icon-arrow-down"
                        style={{ color: themeToken.iconColor, fontSize: themeToken.fontSize }}
                      ></IconFont>
              </div>
            </Flex>
          </>
        </Popover>
      </Space>

    </TeamWrapper>
  );
};

export default TeamProjectManage;
