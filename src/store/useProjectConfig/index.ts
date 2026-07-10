import { INIT_DOMAIN_INFO, INIT_ENV_LIST, INIT_SERVER_LIST } from '@/constants/project';
import { create } from '@/store/utils';
import { EnvList, ServerItem } from '@/types/envManage';
import { RequestGlobalParams } from '@/types/project';
import { DomainInfoProps } from '@/types/project/cookie';

type State = {
  globalVars: any;
  globalParams: Partial<RequestGlobalParams>;
  globalParamsTabKey: string;
  envList: EnvList;
  envOpen: boolean;
  envSettingKeys: string;
  establish: boolean;
  envDetailKeys: string;
  tags: string[];
  cookie: DomainInfoProps;
  serverList:ServerItem[];
  customMethodList:string[]; // custom method collection
};

type Action = {
  updateGlobalVars: (p: any) => void;
  updateGlobalParams: (p: State['globalParams']) => void;
  updateGlobalParamsTabKey: (p: State['globalParamsTabKey']) => void;
  updateEnvList: (p: State['envList']) => void;
  updateServerList: (p: State['serverList']) => void;
  updateEnvOpen: (p: State['envOpen']) => void;
  updateEnvSettingKeys: (p: State['envSettingKeys']) => void;
  updateEstablish: (p: State['establish']) => void;
  updateEnvDetailKeys: (p: State['envDetailKeys']) => void;
  updateTags: (p: State['tags']) => void;
  updateCookie: (p: State['cookie']) => void;
  updateProjectConfig: (p: State) => void;
  updateCustomMethodList: (config: string[]) => void;
};

export default create<State & Action>()((set) => ({
  globalVars: {},
  globalParams: {},
  envList: INIT_ENV_LIST,
  serverList:INIT_SERVER_LIST,
  envOpen: false,
  envSettingKeys: '',
  establish: false,
  envDetailKeys: '',
  tags: [],
  globalParamsTabKey:'Headers',
  cookie: INIT_DOMAIN_INFO,
  customMethodList:[],
  updateGlobalVars: (payload) => set((state) => ({ ...state, globalVars: payload })),
  updateEnvList: (payload) => set((state) => ({ ...state, envList: payload })),
  updateEnvOpen: (payload) => set((state) => ({ ...state, envOpen: payload })),
  updateEnvSettingKeys: (payload) => set((state) => ({ ...state, envSettingKeys: payload })),
  updateEstablish: (payload) => set((state) => ({ ...state, establish: payload })),
  updateEnvDetailKeys: (payload) => set((state) => ({ ...state, envDetailKeys: payload })),
  updateGlobalParams: (payload) => set((state) => ({ ...state, globalParams: payload })),
  updateGlobalParamsTabKey: (payload) => set((state) => ({ ...state, globalParamsTabKey: payload })),
  updateTags: (payload) => set((state) => ({ ...state, tags: payload })),
  updateCookie: (payload) => set((state) => ({ ...state, cookie: payload })),
  updateProjectConfig:(payload) => set((state) => ({ ...state, ...payload  })),
  updateServerList:(payload) => set((state) => ({ ...state, serverList:payload  })),
  updateCustomMethodList:(payload) => set((state) => ({ ...state, customMethodList:payload  })),
}));
