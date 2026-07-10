import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useGlobal, useSystemConfig } from '@/store';

import { generateComponents } from './components';
// Import generateComponents from './components' module
import { getAntdTheme } from './theme';
// Import getAntdTheme from './theme' module
import { generateToken } from './token';

// Import generateToken from './token' module

/**
 * Use global theme
 */

const useGlobalTheme = () => {
  const { theme_color, bg_color, font_scale } = useSystemConfig(
    useShallow(({ systemConfig }) => ({
      theme_color: systemConfig.theme_color,
      bg_color: systemConfig.bg_color,
      font_scale: systemConfig.font_scale,
    }))
  ); // Destructure theme and themeMode from useUserConfigStore

  const vscodeTheme = useGlobal(store => store.vscodeTheme);

  const antdThemeConfig = useMemo(() => {
    return getAntdTheme(theme_color, bg_color, font_scale); // Call getAntdTheme with theme and themeMode, assign result to antdThemeConfig
  }, [theme_color, bg_color, font_scale, vscodeTheme]);

  return {
    cssVar: true,
    hash: false,
    token: generateToken(antdThemeConfig), // Call generateToken with antdThemeConfig, assign result to token
    components: generateComponents(antdThemeConfig), // Call generateComponents with antdThemeConfig, assign result to components
  };
};
export default useGlobalTheme; // Export useGlobalTheme as default
