
import { TeamItem, UserInfo } from '@/types/user';
import { get, post } from './utils';



/**
 * Polling login check interface
 */
export const LoginCheckService = (url:string, data?:any) => {
  return get({ url, data });
};

/**
 * Get team project tree list
 */
export const getTeamProjectTreeListService = (): Promise<TeamItem[]> => {
  return get({ url: '/ide/vscode/project/tp_tree_list', showFailedErrorMsg: false });
};

/**
 * Get polling interface and redirect URL
 */
export const getOauthPreLoginInfoService = (data:{from:string}): Promise<TeamItem[]> => {
  return get({ url: '/ide/login/pre_login', data });
};


/**
 * User logout
 */
export const userLogoutService = (): Promise<any> => {
  return get({ url: '/ide/login/logout', showFailedErrorMsg: false });
};

/**
 * Get user info
 */
export const getUserInfoService = (): Promise<UserInfo> => {
  return get({ url: '/ide/user/info' });
};

