import axios from 'axios';


import { RequestConfig } from './types';
import useShare from '@/store/useShare';


function removeTrailingSubstring(str:string, trailingStr:string) {
  if (str.endsWith(trailingStr)) {
    return str.slice(0, -trailingStr.length);
  }
  return str;
}

const crossRequest = (config: RequestConfig) => {

  const { docBaseUrl }  = useShare.getState();

  let baseUrl = removeTrailingSubstring(docBaseUrl,'/api-docs');

  // Reset URL
  const originUrl = `${baseUrl}/proxy/fetch`;
  config.headers = {
    ...config.headers,
    Accept: 'application/json',
    'origin-url': config.url,
  };
  config.url = originUrl;
  return axios(config);
};

export const crossPost = (config: Omit<RequestConfig, 'method'>) => {
  return crossRequest({
    method: 'post',
    ...config,
  });
};