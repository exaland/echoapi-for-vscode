import { beautifyRaw, snowflakeId } from 'apipost-tools';
import { findIndex, forEach, trim } from 'lodash';

export const getBeautifulRaw = (raw: any) => {
  try {
    return beautifyRaw(raw)?.value;
  } catch (err) {
    return raw;
  }
};

export const throwResult = (status: 'error' | 'success', message: string, data: any = '') => {
  return {
    status,
    message,
    data,
  };
};

export const isArray = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Array]';
};

export const DEFAULT_BODY = {
  mode: 'none',
  parameter: [],
  raw: '',
  raw_parameter: [],
  raw_schema: {
    type: 'object',
    properties: {},
  },
  binary: {},
};

export const isURL = (_url: string) => {
  if (!_url) {
    return false;
  }
  _url = trim(_url);
  return (
    _url.substr(0, 7).toLowerCase() === 'http://' || _url.substr(0, 8).toLowerCase() === 'https://'
  );
};

export const createUrl = (_url: any): any => {
  if (typeof _url !== 'string') {
    _url += '';
  }
  if (!isURL(_url)) {
    _url = `http://${_url}`;
  }

  // eslint-disable-next-line no-useless-escape
  const hostReg = /(http([s]?):\/\/)([^\/\?\\#]*)([\/|\?|\\#]?)/i;
  const host_arr = _url.match(hostReg);
  const protocol = host_arr[1];
  const host = host_arr[3];

  // Domain part
  const origin = protocol + host;

  // Remaining part
  _url = `https://www.apipost.cn${_url.substring(origin.length)}`;

  let urls = {};
  try {
    urls = new URL(_url);
  } catch {
    const http_url = `https://www.apipost.cn${_url.substring(origin.length)}`;
    const a = document.createElement('a');
    a.href = http_url;
    urls = {
      source: _url,
      href: a.href,
      protocol: a.protocol,
      host: a.hostname,
      hostname: a.hostname,
      port: a.port,
      origin: a.origin,
      search: a.search,
      pathname: a.pathname,
      // eslint-disable-next-line no-useless-escape
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
      hash: a.hash,
    };
  }
  return urls;
};

// Generate new restful array based on URL
export const genRestfulByUrl = (url: string, oldParameter: Array<any>): Array<any> => {
  const restfulList: any = [];
  // Auto-prepend URL with http://
  if (!isURL(url)) {
    url = `http://${url}`;
  }
  const urlObj = createUrl(url);
  const paths = urlObj.pathname.split('/');

  forEach(paths, (pathsItem: any) => {
    if (pathsItem.substring(0, 1) === ':' && pathsItem.length > 1) {
      let obj: any = null;

      const oldIndex = findIndex(oldParameter, {
        key: pathsItem.substring(1, pathsItem.length),
      });

      if (oldIndex !== -1) {
        obj = oldParameter[oldIndex];
      }

      restfulList.push({
        param_id: obj?.param_id || snowflakeId(),
        field_type: 'String',
        is_checked: 1,
        key: pathsItem.substring(1, pathsItem.length),
        not_null: 1,
        value: obj?.value || '',
        description: obj?.description || '',
      });
    }
  });

  const regex = /(?<!{){([^{}]+)}(?!})/g;

  try {
    const matches: any = url.match(regex);

    if (isArray(matches) && matches.length > 0) {
      forEach(matches, (matchesItem) => {
        if (matchesItem.length > 0) {
          matchesItem = matchesItem.replace(/^{|}$/g, '');

          let obj: any = null;
          const oldIndex = findIndex(oldParameter, {
            key: matchesItem,
          });

          if (oldIndex !== -1) {
            obj = oldParameter[oldIndex];
          }

          restfulList.push({
            param_id: obj?.param_id || snowflakeId(),
            field_type: 'String',
            is_checked: 1,
            key: matchesItem,
            not_null: 1,
            value: obj?.value || '',
            description: obj?.description || '',
          });
        }
      });
    }
  } catch (error) {}
  return restfulList;
};

export const removePTags = (str: string) => {
  // Use regex to replace <p> and </p> tags with empty string
  return str.replace(/<\/?[^>]+(>|$)/g, '');
};
