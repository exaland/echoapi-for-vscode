import { omit } from 'lodash';

import { DEFAULT_REQUEST_SYSTEM_HEADERS } from '@/constants/apis/request';
import { create, devtools } from '@/store/utils';
import { ApiDetailsData, ApiPressureData, MockDetails } from '@/types/apis/api';
import { ApisBaseData } from '@/types/apis/base';
import { DefaultRequestSystemHeaders } from '@/types/apis/request';
import { ApiSendingData, ApiSendingDataSSE } from '@/types/apis/send';

type State = {
  /**apis raw base data flat list */
  apiOriginBaseList: ApisBaseData[];
  /**apis raw details data flat list (confirm if needed) */
  apiOriginDetailsList: ApiDetailsData[];
  /**apis base kv data */
  apiBaseData: { [x: string]: ApisBaseData };
  /**apis details kv data */
  apiDetailsData: { [x: string]: ApiDetailsData };
  /**apis tabs open list */
  opensApiList: string[];
  /**apis tabs open details */
  opensApiDetailsData: { [x: string]: ApiDetailsData };
  /**apis tabs currently active key */
  apisActiveKey: string;
  testsActiveKey: string;
  docsActiveKey: string;
  /**apis tabs currently active details */
  apisActiveData: ApiDetailsData;

  /**tree loading */
  treeLoading: boolean;
  /**details loading */
  detailsLoading: boolean;
  /**apis sending kv data */
  apiSendingData: { [x: string]: Partial<ApiSendingData> };
  /**current apis sending kv data */
  currentSendingData: undefined | Partial<ApiSendingData>;
  currentSseSendingData: Partial<ApiSendingDataSSE>;

  currentServerId: string;

  /**apis sending sse kv data */
  apiSendingDataSSE: { [x: string]: Partial<ApiSendingDataSSE> };
  /**system request header */
  systemRequestHeader: DefaultRequestSystemHeaders[];
  /**mock interface map */
  mockDetailsData: { [x: string]: MockDetails };
  /**one-click pressure test data */
  pressureData: { [x: string]: ApiPressureData };
  /**tabs operation menu config */
  tabsOperatesMenusConfig: { saveAllLoading?: boolean };
  /**tabs reuse id */
  tabsReuseTargetId: string;

  // local api version records across different projects
  localProjectApisVersion: { [x: string]: number };

  apiCodeHar: any;

  schemaLoading: boolean;
};

type Action = {
  updateApisStore: (apisData: State) => void;
  updateApiBaseData: (apiBaseData: State['apiBaseData']) => void;
  updateApiDetailsData: (apiDetailsData: State['apiDetailsData']) => void;
  updateAllApiDetailsData: (apiDetailsData: State['apiDetailsData']) => void;
  updateApiOriginBaseList: (apiOriginBaseList: State['apiOriginBaseList']) => void;
  updateApiOriginDetailsList: (apiOriginDetailsList: State['apiOriginDetailsList']) => void;

  updateApiCodeHar: (apiCodeHar: State['apiCodeHar']) => void;
  updateSchemaLoading: (schemaLoading: State['schemaLoading']) => void;
  updateOpensApiList: (opensApiList: State['opensApiList']) => void;
  updateOpensApiDetailsDataByTargetId: (opensApiDetailsData: ApiDetailsData) => void;
  updateOpensApiDetailsData: (opensApiDetailsData: State['opensApiDetailsData']) => void;
  updateAllOpensApiDetailsData: (opensApiDetailsData: State['opensApiDetailsData']) => void;

  updateApisActiveKey: (apisActiveKey: State['apisActiveKey']) => void;
  updateTestsActiveKey: (testsActiveKey: State['testsActiveKey']) => void;
  updateDocsActiveKey: (docsActiveKey: State['docsActiveKey']) => void;
  updateCurrentServerId: (currentServerId: State['currentServerId']) => void;

  updateTreeLoading: (treeLoading: State['treeLoading']) => void;
  updateDetailsLoading: (detailsLoading: State['detailsLoading']) => void;

  updateApiSendingDataByTargetId: (apiSendingData: Partial<ApiSendingData>) => void;
  updateApiSendingData: (apiSendingData: State['apiSendingData']) => void;
  updateCurrentSendingData: (currentSendingData: State['currentSendingData']) => void;

  updateCurrentSseSendingData: (currentSseSendingData: State['currentSseSendingData']) => void;

  coverApiSendingConsole: (apiSendingData: Partial<ApiSendingData>) => void;
  updateMockDetailsData: (mockDetailsData: State['mockDetailsData']) => void;
  updateLocalProjectApisVersion: (pressureData: State['localProjectApisVersion']) => void;

  updateTabsOperatesMenusConfig: (
    tabsOperatesMenusConfig: State['tabsOperatesMenusConfig']
  ) => void;
  updateSystemRequestHeader: (systemRequestHeader: State['systemRequestHeader']) => void;

  updateApiSendingDataSSE: (apiSendingDataSSE: State['apiSendingDataSSE']) => void;
  updateApiSendingDataSSEItem: (apiSendingDataSSE: State['apiSendingDataSSE']) => void;
  updateTabsReuseTargetId: (tabsReuseTargetId: State['tabsReuseTargetId']) => void;

  updatePressureData: (pressureData: State['pressureData']) => void;

  updateApisActiveData: (apisActiveData: State['apisActiveData']) => void
};

const useApis = create<State & Action>()(
  devtools(
    (set) => ({
      apiCodeHar: {},
      apiBaseData: {},
      apiDetailsData: {},
      apiOriginBaseList: [],
      apiOriginDetailsList: [],
      opensApiList: [],
      opensApiDetailsData: {},
      apisActiveKey: '',
      treeLoading: false,
      detailsLoading: false,
      apiSendingData: {},
      currentSendingData: undefined,
      systemRequestHeader: DEFAULT_REQUEST_SYSTEM_HEADERS,
      mockDetailsData: {},
      tabsOperatesMenusConfig: { saveAllLoading: false },
      testsActiveKey: '',
      docsActiveKey: '',
      pressureData: {},
      apisActiveData: {} as ApiDetailsData,
      currentSseSendingData: {} as ApiSendingDataSSE,
      apiSendingDataSSE: {},
      tabsReuseTargetId: '',
      localProjectApisVersion: {},
      currentServerId: '',
      schemaLoading: false,
      updateCurrentSseSendingData: (currentSseSendingData) => set(() => ({ currentSseSendingData })),
      updateCurrentSendingData: (currentSendingData) => set(() => ({ currentSendingData })),
      // store full update
      updateApisStore: (apisData) => set(() => apisData),

      updateApiBaseData: (apiBaseData) => set(() => ({ apiBaseData })),
      // update apis details data
      updateApiDetailsData: (payload) =>
        set((state) => ({ apiDetailsData: { ...state.apiDetailsData, ...payload } })),
      // full update apis details data
      updateAllApiDetailsData: (apiDetailsData) => set(() => ({ apiDetailsData })),

      updateApiOriginBaseList: (apiOriginBaseList) => set(() => ({ apiOriginBaseList })),
      updateApiOriginDetailsList: (apiOriginDetailsList) => set(() => ({ apiOriginDetailsList })),

      updateApiCodeHar: (apiCodeHar) => set(() => ({ apiCodeHar })),
      updateCurrentServerId: (currentServerId) => set(() => ({ currentServerId })),
      updateOpensApiList: (opensApiList) => set(() => ({ opensApiList })),
      // update opens apis details data
      updateOpensApiDetailsData: (payload) =>
        set((state) => ({ opensApiDetailsData: { ...state.opensApiDetailsData, ...payload } })),
      // full update opens apis details data
      updateAllOpensApiDetailsData: (opensApiDetailsData) => set(() => ({ opensApiDetailsData })),

      updateOpensApiDetailsDataByTargetId: (payload) =>
        set((state) => ({
          opensApiDetailsData: {
            ...state.opensApiDetailsData,
            ...(payload?.target_id ? { [payload.target_id]: payload } : {}),
          },
        })),

      updateTreeLoading: (treeLoading) => set(() => ({ treeLoading })),
      updateDetailsLoading: (detailsLoading) => set(() => ({ detailsLoading })),
      updateSchemaLoading: (schemaLoading) => set(() => ({ schemaLoading })),
      updateApisActiveKey: (apisActiveKey) => set(() => ({ apisActiveKey })),
      updateTestsActiveKey: (testsActiveKey) => set(() => ({ testsActiveKey })),
      updateDocsActiveKey: (docsActiveKey) => set(() => ({ docsActiveKey })),
      updateApiSendingData: (apiSendingData) => set(() => ({ apiSendingData })),
      updateApiSendingDataByTargetId: (payload) =>
        set((state) => {
          if (!payload.target_id) return state;

          return {
            apiSendingData: {
              ...state.apiSendingData,
              [payload.target_id]: {
                ...state.apiSendingData[payload.target_id],
                ...omit(payload, payload.target_id),
              },
            },
          };
        }),
      coverApiSendingConsole: (payload) =>
        set((state) => {
          if (!payload.target_id) return state;

          return {
            apiSendingData: {
              ...state.apiSendingData,
              [payload.target_id]: {
                ...state.apiSendingData[payload.target_id],
                ...omit(payload, payload.target_id),
                consoleList: payload?.consoleList,
              },
            },
          };
        }),
      updateMockDetailsData: (mockDetailsData) => set(() => ({ mockDetailsData })),
      updatePressureData: (pressureData) => set(() => ({ pressureData })),

      updateTabsOperatesMenusConfig: (payload) =>
        set((state) => ({
          tabsOperatesMenusConfig: { ...state.tabsOperatesMenusConfig, ...payload },
        })),

      updateSystemRequestHeader: (systemRequestHeader) => set(() => ({ systemRequestHeader })),

      /**update SSE api sending data */
      updateApiSendingDataSSE: (apiSendingDataSSE) => set(() => ({ apiSendingDataSSE })),
      /**update SSE api sending data item */
      updateApiSendingDataSSEItem: (payload) =>
        set((state) => ({ apiSendingDataSSE: { ...state.apiSendingDataSSE, ...payload } })),
      updateTabsReuseTargetId: (tabsReuseTargetId) => set(() => ({ tabsReuseTargetId })),
      updateLocalProjectApisVersion: (localProjectApisVersion) => set(() => ({ localProjectApisVersion })),
      updateApisActiveData: (apisActiveData) => set(() => ({ apisActiveData })),
    }),
    { name: 'useApis' }
  )
);

export default useApis;
