import { create } from 'zustand';

import { SYS_CONFIG } from '@/constants/settings';
import { SysConfig } from '@/types/settings';

type State = {
  systemConfig: SysConfig;
};

type Action = {
  updateSystemConfig: (config: SysConfig) => void;
};

const useSystemConfig = create<State & Action>()((set) => ({
  systemConfig: SYS_CONFIG,
  /** update system config */
  updateSystemConfig: (config) => set({ systemConfig: config }),
}));

export default useSystemConfig;
