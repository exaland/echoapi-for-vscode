import { create } from 'zustand';

import { devtools } from '@/store/utils';
import { Project, TeamItem, UserInfo, UserListRes } from '@/types/user';

type State = {
  /**current user readonly permission */
  isReadonly: boolean;
  /**login status */
  token: string;
  /**user info */
  userInfo: UserInfo;
  /**team project list */
  teamProjectList: TeamItem[];
  /**current team */
  currentTeam: TeamItem;
  /**current project */
  currentProject: Project;
  /**user list */
  userList: UserListRes[];
  /**current online users */
  onlineUserList: UserListRes[];
  /**streamline mode */
  streamliningMode: number;
  /**preview 3 modes */
  designMode: 'edit' | 'read' | 'both';
};

type Action = {
  updateIsReadonly: (isReadonly: State['isReadonly']) => void;
  updateToken: (isLogin: State['token']) => void;
  updateCurrentProject: (currentProject: State['currentProject']) => void;
  updateCurrentTeam: (currentTeam: State['currentTeam']) => void;
  updateTeamProjectList: (teamProjectList: State['teamProjectList']) => void;
  updateUserInfo: (userInfo: State['userInfo']) => void;
  updateUserList: (userList: State['userList']) => void;
  updateOnlineUserList: (onlineUserList: State['onlineUserList']) => void;
  updateStreamliningMode: (streamliningMode: State['streamliningMode']) => void;
  updateDesignMode: (designMode: State['designMode']) => void;
  updateUserConfig:(state:State )=>void;
};

const useUserConfig = create<State & Action>()(
  devtools(
    (set) => ({
      isReadonly: false,
      token: '',
      userInfo: {} as UserInfo,
      teamProjectList: [] as TeamItem[],
      currentTeam: {} as TeamItem,
      currentProject: {} as Project,
      userList: [] as UserListRes[],
      onlineUserList: [] as UserListRes[],
      streamliningMode: -1,
      designMode: 'edit',

      updateIsReadonly: (isReadonly) => set(() => ({ isReadonly })),
      updateToken: (token) => set(() => ({ token })),
      updateCurrentProject: (currentProject) => set(() => ({ currentProject })),
      updateCurrentTeam: (currentTeam) => set(() => ({ currentTeam })),
      updateTeamProjectList: (teamProjectList) => set(() => ({ teamProjectList })),
      updateUserInfo: (userInfo) => set(() => ({ userInfo })),
      updateUserList: (userList) => set(() => ({ userList })),
      updateOnlineUserList: (onlineUserList) => set(() => ({ onlineUserList })),
      updateStreamliningMode: (streamliningMode) => set(() => ({ streamliningMode })),
      updateDesignMode: (designMode) => set(() => ({ designMode })),
      updateUserConfig:(payload)=>set((state) => ({ ...state, ...payload  }))
    }),
    { name: 'useUserConfig' }
  )
);

export default useUserConfig;
