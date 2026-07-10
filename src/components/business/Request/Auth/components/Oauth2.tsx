/* eslint-disable no-useless-escape */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Flex, Form, Select, Typography, message } from 'antd';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { snowflakeId } from 'apipost-tools';
import { SHA256, enc } from 'crypto-js';
import {
  cloneDeep,
  entries,
  find,
  has,
  includes,
  isArray,
  isEmpty,
  isEqual,
  isNull,
  isString,
  keys,
  last,
  merge,
  reduce,
  setWith,
} from 'lodash';

import { BasicTable, SegmentedTabs, VarInput } from '@/components/business';
import { Button, IconFont, Tooltip } from '@/components/ui';
import GhostCollapse from '@/components/ui/GhostCollapse';
import {
  AUTH_ENUM,
  AUTH_OAUTH2_AUTHENTICATION,
  AUTH_OAUTH2_CHALLENGE,
  AUTH_OAUTH2_GRANT_TYPE,
  AUTH_OAUTH2_GRANT_TYPE_MAP,
  AUTH_OAUTH2_LOCATION,
  AUTH_OAUTH2_SEND_IN,
} from '@/constants/apis/auth';
import { useApis, useProjectConfig, useStorage, useUserConfig } from '@/store';
import { AuthOauth2, RequestParamsItem } from '@/types/apis/auth';
import { openUrl } from '@/utils/open';

import { MoreTipContainer, Oauth2Container } from '../style';

type DataSourceItem = {
  key: string;
  value: string;
  enabled: boolean;
  send_as: string;
  static?: boolean;
  param_id?: string;
};

type ObjectItem = { [key: string]: string };

type AccessInfo = {
  code?: string;
  state?: string;
};

type TokenInfo = Omit<
  AuthOauth2,
  | 'access_token'
  | 'addTokenTo'
  | 'headerPrefix'
  | 'challengeAlgorithm'
  | 'client_authentication'
  | 'refreshTokenUrl'
  | 'refreshRequestParams'
>;

interface TableProps {
  value?: DataSourceItem[];
  onChange?: any;
  hasSendIn?: boolean;
}

interface Props {
  onChange: (v: AuthOauth2) => void;
  target_id?: string | undefined;
}

export const DEFAULT_ITEM = {
  key: '',
  value: '',
  send_as: 'request_body',
  param_id: '',
  static: true,
  enabled: true,
};

const ParamsTable = ({ value, onChange, hasSendIn = false }: TableProps) => {
  const lastRowDataRef = useRef<any>(null);
  const handleItemChange = (rowData: any, index: number, newVal: any) => {
    const newList: Array<DataSourceItem> = cloneDeep(value || []);
    delete rowData.static;
    newList[index] = {
      ...rowData,
      ...newVal,
    };
    onChange?.([...newList]);
  };

  const columns = [
    {
      title: '',
      width: 24,
      dataIndex: 'enabled',
      render: (text: boolean, rowData: DataSourceItem, rowIndex: number) => {
        return (
          <Flex style={{ paddingInline: 4 }} align="center">
            <Checkbox
              checked={text}
              onChange={(e) => handleItemChange(rowData, rowIndex, { enabled: e?.target?.checked })}
              disabled={!!rowData?.static}
            />
          </Flex>
        );
      },
    },
    {
      title: 'Key',
      width: 150,
      dataIndex: 'key',
      render: (text: string, rowData: DataSourceItem, rowIndex: number) => (
        <VarInput
          wrapClassName={'oauth-input'}
          value={text}
          onChange={(e) => {
            handleItemChange(rowData, rowIndex, { key: e });
          }}
        />
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (text: string, rowData: DataSourceItem, rowIndex: number) => (
        <VarInput
          wrapClassName={'oauth-input'}
          value={text}
          onChange={(e) =>
            handleItemChange(rowData, rowIndex, {
              value: e,
            })
          }
        />
      ),
    },
  ];

  const sendColumns = [
    {
      title: 'Send In',
      width: 150,
      dataIndex: 'send_as',
      render: (text: string, rowData: DataSourceItem, rowIndex: number) => (
        <Select
          value={text}
          onChange={(e) =>
            handleItemChange(rowData, rowIndex, {
              send_as: e,
            })
          }
          options={AUTH_OAUTH2_SEND_IN}
        />
      ),
    },
  ];

  const tableDataList = useMemo(() => {
    if (!isArray(value) || isEmpty(value)) {
      DEFAULT_ITEM.param_id = snowflakeId();

      return [{ ...DEFAULT_ITEM }];
    }

    const hasStatic = value?.some((item) => item?.static);

    if (!hasStatic) {
      // Record the last row data to avoid duplicate generation of new param_id, causing unnecessary refresh
      const usedLastRowData =
        isNull(lastRowDataRef.current) ||
        isEqual(last(value)?.param_id, lastRowDataRef.current?.param_id);

      if (usedLastRowData) {
        DEFAULT_ITEM.param_id = snowflakeId();
        lastRowDataRef.current = DEFAULT_ITEM;

        return [...value, DEFAULT_ITEM];
      }

      return [...value, lastRowDataRef.current as DataSourceItem];
    }

    return value;
  }, [value]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (isEqual(active.id, over?.id)) return;
    const _dataSource = cloneDeep(value as DataSourceItem[]);
    const activeIndex = _dataSource.findIndex((i) => i.param_id === active.id);
    const overIndex = _dataSource.findIndex((i) => i.param_id === over?.id);
    const newDataSource = arrayMove(_dataSource, activeIndex, overIndex);

    onChange?.(newDataSource);
  };

  return (
    <BasicTable
      dragEnable
      onDragEnd={onDragEnd}
      dataSource={tableDataList}
      rowKey="param_id"
      columns={hasSendIn ? [...columns, ...sendColumns] : columns}
      pagination={false}
    />
  );
};

const Oauth2 = (props: Props) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const childWindow = useRef<any>(null);
  const tokenInfo = useRef<Partial<TokenInfo> | null>(null);
  const [tabsValue, setTabsValue] = useState<string>('authRequestParams');
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const grantType = Form.useWatch([AUTH_ENUM.OAUTH2, 'grant_type']);
  const clientId = Form.useWatch([AUTH_ENUM.OAUTH2, 'clientId']);
  const refreshTokenUrl = Form.useWatch([AUTH_ENUM.OAUTH2, 'refreshTokenUrl']);
  const envList = useProjectConfig((state) => state.envList);
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const globalVars = useProjectConfig((state) => state.globalVars);
  const apisActiveKey = useApis((state) => state.apisActiveKey);
  const uid = useUserConfig((state) => state?.userInfo?.uid);
  const getOauthRefreshData = useStorage((state) => state.getOauthRefreshData);

  const closeChildWindow = () => {
    try {
      childWindow?.current?.close();
    } catch (e) {}
  };

  const getAccessToken = async ({ code, state }: AccessInfo) => {
    const {
      tokenRequestParams = [],
      accessTokenUrl = '',
      clientId,
      clientSecret,
      redirect_uri,
      grant_type,
      code_verifier,
      password,
      username,
    } = tokenInfo.current || {};
    const { data, params, headers } = tokenRequestParams.reduce(
      (pre, { key, value, send_as }) => {
        const { data, params, headers } = pre;
        if (isEqual(send_as, 'request_body')) {
          data[key] = value;
        } else if (isEqual(send_as, 'request_url')) {
          params[key] = value;
        } else {
          headers[key] = value;
        }
        return pre;
      },
      {
        data: {} as ObjectItem,
        params: {} as ObjectItem,
        headers: {} as ObjectItem,
      }
    );
    const prams = {
      ...data,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri,
      grant_type:
        grant_type && has(AUTH_OAUTH2_GRANT_TYPE_MAP, grant_type)
          ? AUTH_OAUTH2_GRANT_TYPE_MAP[grant_type]
          : undefined,
    };
    if (code) {
      setWith(prams, ['code'], code, Object);
    }
    if (state) {
      setWith(prams, ['state'], state, Object);
    }
    if (isEqual(grant_type, 'authorization_code_with_pkce')) {
      setWith(prams, ['code_verifier'], code_verifier, Object);
    }
    if (isEqual(grant_type, 'password_credentials')) {
      setWith(prams, ['password'], password, Object);
      setWith(prams, ['username'], username, Object);
    }
    
    try {
      window?.vscode.postMessage({
        action: '/proxy/fetch',
        data:{
          url: accessTokenUrl,
          data: prams,
          headers: {
            ...headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          options: { params },
        }
      });
     
      closeChildWindow();
    } catch (err: any) {
      message.error(t('common.auth.get_access_fail'));
      closeChildWindow();
    }
  };

  const handleMessage = (e: any) => {
    const isEqualOrigin = e?.origin === location.origin;
    if (e?.data?.source === 'oauth-source-subpage' && isEqualOrigin) {
      const watching = isEqual(props.target_id, apisActiveKey);
      if (e?.data?.payload?.code && watching) {
        getAccessToken({ code: e?.data?.payload?.code, state: e?.data?.payload?.state });
      }
    }
  };

  const refreshToken = useMemo(() => {
    return getOauthRefreshData([uid, clientId, 'refresh_token']);
  }, [uid, clientId]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      closeChildWindow();
      window.removeEventListener('message', handleMessage);
    };
  }, [apisActiveKey]);

  const segmentedOptions = useMemo(() => {
    const authRequest = {
      label: 'Auth Request',
      key: 'authRequestParams',
      value: 'authRequestParams',
      children: (
        <Flex vertical gap={4}>
          <Typography.Text style={{ color: 'var(--font-light-color)', marginBottom: 20 }}>
            {t('common.auth.auth_table_tip')}
          </Typography.Text>
          <Form.Item noStyle name={[AUTH_ENUM.OAUTH2, 'authRequestParams']}>
            <ParamsTable />
          </Form.Item>
        </Flex>
      ),
    };
    const tokenRequest = {
      label: 'Token Request',
      key: 'tokenRequestParams',
      value: 'tokenRequestParams',
      children: (
        <Flex vertical gap={4}>
          <Typography.Text style={{ color: 'var(--font-light-color)', marginBottom: 12 }}>
            {t('common.auth.token_table_tip')}
          </Typography.Text>
          <Form.Item noStyle name={[AUTH_ENUM.OAUTH2, 'tokenRequestParams']}>
            <ParamsTable hasSendIn />
          </Form.Item>
        </Flex>
      ),
    };
    const refreshRequest = {
      label: 'Refresh Request',
      key: 'refreshRequestParams',
      value: 'refreshRequestParams',
      children: (
        <Flex vertical gap={4}>
          <Typography.Text style={{ color: 'var(--font-light-color)', marginBottom: 12 }}>
            {t('common.auth.refresh_table_tip')}
          </Typography.Text>
          <Form.Item noStyle name={[AUTH_ENUM.OAUTH2, 'refreshRequestParams']}>
            <ParamsTable hasSendIn />
          </Form.Item>
        </Flex>
      ),
    };
    if (isEqual(grantType, 'implicit')) {
      if (isEqual(tabsValue, 'tokenRequestParams')) {
        setTabsValue('authRequestParams');
      }
      return [authRequest, refreshRequest];
    }
    if (['password_credentials', 'client_credentials'].includes(grantType)) {
      if (isEqual(tabsValue, 'authRequestParams')) {
        setTabsValue('tokenRequestParams');
      }
      return [tokenRequest, refreshRequest];
    }
    return [authRequest, tokenRequest, refreshRequest];
  }, [grantType]);

  const globalsMap = useMemo(() => {
    return reduce(
      keys(globalVars),
      (prev: any, curr) => {
        prev[curr] = isString(globalVars[curr]?.current_value)
          ? globalVars[curr]?.current_value
          : JSON.stringify(globalVars[curr]?.current_value);

        return prev;
      },
      {}
    );
  }, [globalVars]);

  const environmentMap = useMemo(() => {
    const currentEnv = find(envList, (item) => item.env_id === envDetailKeys);
    return entries(currentEnv?.env_var_list).reduce(
      (pre, [key, obj]: any) => {
        pre[key] = isString(obj?.current_value)
          ? obj?.current_value
          : JSON.stringify(obj?.current_value);
        return pre;
      },
      {} as Record<string, any>
    );
  }, [envList, envDetailKeys]);

  const validateUrl = (str: string = ''): Promise<string> =>
    new Promise((resolve, reject) => {
      const reg = /\{\{(?![\$!])[^\{\}]+\}\}/g;
      const matches = str.match(reg);
      if (!matches) {
        resolve(str);
      }
      const varMap = merge(globalsMap, environmentMap);
      for (let i = 0; i < (matches?.length || 0); i++) {
        const e = (matches as RegExpMatchArray)[i];
        const v = e.slice(2, -2);
        if (!has(varMap, v)) {
          reject(v);
          break;
        }
      }
      const newStr = str.replace(reg, (match) => {
        const key = match.slice(2, -2);
        return varMap[key];
      });
      resolve(newStr);
    });

  const validateTableParams = (arr: DataSourceItem[]): Promise<DataSourceItem[]> =>
    new Promise((resolve, reject) => {
      const reg = /\{\{(?![\$!])[^\{\}]+\}\}/g;
      const varMap = merge(globalsMap, environmentMap);
      const newArr = [];
      let shouldBreak = false;
      const effectiveArr = arr.filter((item) => !!item?.key);
      for (let i = 0; i < effectiveArr.length; i++) {
        const item = effectiveArr[i];
        const keyMatches = item.key.match(reg);
        const valueMatches = item.value.match(reg);
        if (keyMatches || valueMatches) {
          const key = keyMatches?.find((e) => !has(varMap, e.slice(2, -2)));
          if (key) {
            reject(key.slice(2, -2));
            shouldBreak = true;
            break;
          }
          const value = valueMatches?.find((e) => !has(varMap, e.slice(2, -2)));
          if (value) {
            reject(value.slice(2, -2));
            shouldBreak = true;
            break;
          }
          const newItem = {
            ...item,
            key: item.key.replace(reg, (match) => {
              const key = match.slice(2, -2);
              return varMap[key];
            }),
            value: item.value.replace(reg, (match) => {
              const key = match.slice(2, -2);
              return varMap[key];
            }),
          };
          if (newItem.key) {
            newArr.push(newItem);
          }
        } else {
          newArr.push(item);
        }
        if (shouldBreak) {
          break;
        }
      }
      resolve(newArr);
    });

  const handleGetTokenByPassword = async () => {
    const { oauth2 = {} } = await form.validateFields();
    const {
      clientId,
      scope,
      state,
      accessTokenUrl,
      clientSecret,
      tokenRequestParams,
      grant_type,
      password,
      username,
    } = oauth2 || {};
    try {
      const [
        _clientId,
        _scope,
        _state,
        _accessTokenUrl,
        _clientSecret,
        _password,
        _username,
        _tokenRequestParams,
      ] = await Promise.all([
        await validateUrl(clientId),
        await validateUrl(scope),
        await validateUrl(state),
        await validateUrl(accessTokenUrl),
        await validateUrl(clientSecret),
        await validateUrl(password),
        await validateUrl(username),
        await validateTableParams(tokenRequestParams || []),
      ]);
      tokenInfo.current = {
        clientId: _clientId,
        scope: _scope,
        state: _state,
        accessTokenUrl: _accessTokenUrl,
        clientSecret: _clientSecret,
        password: _password,
        username: _username,
        tokenRequestParams: _tokenRequestParams as unknown as RequestParamsItem[],
        grant_type,
      };
      await getAccessToken({});
    } catch (err) {
      return message.error(t('common.auth.var_not_defined', { err }));
    }
  };

  const handleGetToken = () => {
    if (isEqual(grantType, 'password_credentials')) {
      handleGetTokenByPassword();
    }
  };

  const refreshAccessToken = async ({
    clientId,
    clientSecret,
    redirect_uri,
    refreshTokenUrl,
    refreshRequestParams,
  }: Pick<
    AuthOauth2,
    'refreshRequestParams' | 'clientId' | 'clientSecret' | 'redirect_uri' | 'refreshTokenUrl'
  >) => {
    const { data, params, headers } = refreshRequestParams.reduce(
      (pre, { key, value, send_as }) => {
        const { data, params, headers } = pre;
        if (isEqual(send_as, 'request_body')) {
          data[key] = value;
        } else if (isEqual(send_as, 'request_url')) {
          params[key] = value;
        } else {
          headers[key] = value;
        }
        return pre;
      },
      {
        data: {} as ObjectItem,
        params: {} as ObjectItem,
        headers: {} as ObjectItem,
      }
    );
    const prams: any = {
      ...data,
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri,
    };
 
    try {
      setRefreshLoading(true);
      window?.vscode.postMessage({
        action: '/proxy/fetch',
        data:{
          url: refreshTokenUrl,
          data: prams,
          headers: {
            ...headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          options: { params },
        }
      });
    } catch (err: any) {
      message.error(t('supplement.refresh_fail'));
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    const { oauth2 = {} } = await form.validateFields();
    const { clientId, redirect_uri, clientSecret, refreshRequestParams, refreshTokenUrl } =
      oauth2 || {};
    try {
      const [_clientId, _redirect_uri, _clientSecret, _refreshTokenUrl, _refreshRequestParams] =
        await Promise.all([
          await validateUrl(clientId),
          await validateUrl(redirect_uri),
          await validateUrl(clientSecret),
          await validateUrl(refreshTokenUrl),
          await validateTableParams(refreshRequestParams || []),
        ]);
      await refreshAccessToken({
        clientId: _clientId,
        redirect_uri: _redirect_uri,
        clientSecret: _clientSecret,
        refreshTokenUrl: _refreshTokenUrl,
        refreshRequestParams: _refreshRequestParams as unknown as RequestParamsItem[],
      });
    } catch (err) {
      return message.error(t('common.auth.var_not_defined', { err }));
    }
  };

  const downLoadTip = (
    <div>
      {t('api.stress.stress_settings.test_data_tip')},
      <a onClick={() => openUrl('https://www.echoapi.com/download')}>
        {t('api.stress.stress_settings.test_data_tip_download')}
      </a>
    </div>
  );

  const refreshSuffix =
    refreshToken && refreshTokenUrl ? (
      <Tooltip title={includes(
        ['authorization_code', 'authorization_code_with_pkce'],
        grantType
      ) ? downLoadTip : ''}>
        <Button
          loading={refreshLoading}
          onClick={handleRefreshToken}
          disabled={includes(
            ['authorization_code', 'authorization_code_with_pkce'],
            grantType
          )}
          size="mini"
          type="primary"
          mode="light"
          icon={<IconFont type="icon-refresh" />}
        >
          {t('base.refresh')}
        </Button>
      </Tooltip>
    ) : undefined;

  return (
    <Oauth2Container>
      <Form.Item
        initialValue={'header'}
        label={t('common.auth.add_to')}
        name={[AUTH_ENUM.OAUTH2, 'addTokenTo']}
      >
        <Select options={AUTH_OAUTH2_LOCATION || []} />
      </Form.Item>
      <Form.Item
        tooltip={t('common.auth.header_prefix')}
        initialValue={'Bearer'}
        label={'Header Prefix'}
        name={[AUTH_ENUM.OAUTH2, 'headerPrefix']}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        name={[AUTH_ENUM.OAUTH2, 'access_token']}
        tooltip={t('common.auth.access_token_tip')}
        label={'Token'}
      >
        <VarInput suffix={refreshSuffix} hasBorder />
      </Form.Item>
      <div className="divider"></div>
      <Flex style={{ marginBottom: 20 }} justify="space-between" align="center">
        <span style={{ color: 'var(--font-title-color)' }}>{t('common.auth.get_token')}</span>
        <Tooltip title={includes(
        ['authorization_code', 'authorization_code_with_pkce'],
        grantType
      ) ? downLoadTip : ''}>
          <Button
            onClick={handleGetToken}
            size="small"
            disabled={
              includes(
                ['authorization_code', 'authorization_code_with_pkce'],
                grantType
              )
            }
            type="primary"
          >
            {t('common.auth.get_token')}
          </Button>
        </Tooltip>
      </Flex>
      <Form.Item
        initialValue={'password_credentials'}
        label={'Grant type'}
        name={[AUTH_ENUM.OAUTH2, 'grant_type']}
      >
        <Select options={AUTH_OAUTH2_GRANT_TYPE || []} />
      </Form.Item>
      <Form.Item
        hidden={['client_credentials', 'password_credentials'].includes(grantType)}
        tooltip={t('common.auth.call_url_tip')}
        label={'Callback URL'}
        name={[AUTH_ENUM.OAUTH2, 'redirect_uri']}
        rules={[{ required: !isEqual(grantType, 'password_credentials') }]}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        hidden={['client_credentials', 'password_credentials'].includes(grantType)}
        tooltip={t('common.auth.auth_url_tip')}
        label={'Auth URL'}
        name={[AUTH_ENUM.OAUTH2, 'authUrl']}
        rules={[{ required: !isEqual(grantType, 'password_credentials') }]}
      >
        <VarInput hasBorder />
      </Form.Item>

      <Form.Item
        hidden={isEqual(grantType, 'implicit')}
        tooltip={t('common.auth.access_url_tip')}
        label={'Access Token URL'}
        name={[AUTH_ENUM.OAUTH2, 'accessTokenUrl']}
        rules={[{ required: true }]}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        tooltip={t('common.auth.client_id_tip')}
        label={'Client ID'}
        name={[AUTH_ENUM.OAUTH2, 'clientId']}
        rules={[{ required: !isEqual(grantType, 'password_credentials') }]}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        hidden={isEqual(grantType, 'implicit')}
        tooltip={t('common.auth.client_secret_tip')}
        label={'Client Secret'}
        name={[AUTH_ENUM.OAUTH2, 'clientSecret']}
        rules={[{ required: !isEqual(grantType, 'password_credentials') }]}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        hidden={!isEqual(grantType, 'password_credentials')}
        label={'Username'}
        name={[AUTH_ENUM.OAUTH2, 'username']}
        rules={[{ required: isEqual(grantType, 'password_credentials') }]}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        hidden={!isEqual(grantType, 'password_credentials')}
        label={'Password'}
        name={[AUTH_ENUM.OAUTH2, 'password']}
        rules={[{ required: isEqual(grantType, 'password_credentials') }]}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        hidden={!isEqual(grantType, 'authorization_code_with_pkce')}
        tooltip={t('common.auth.code_method_tip')}
        initialValue={'S256'}
        label={'Code Challenge Method'}
        name={[AUTH_ENUM.OAUTH2, 'challengeAlgorithm']}
      >
        <Select options={AUTH_OAUTH2_CHALLENGE || []} />
      </Form.Item>
      <Form.Item
        hidden={!isEqual(grantType, 'authorization_code_with_pkce')}
        tooltip={t('common.auth.code_verify_tip')}
        label={'Code Verifier'}
        name={[AUTH_ENUM.OAUTH2, 'code_verifier']}
      >
        <VarInput maxLength={128} hasBorder />
      </Form.Item>
      <Form.Item
        tooltip={t('common.auth.scope_tip')}
        label={'Scope'}
        name={[AUTH_ENUM.OAUTH2, 'scope']}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        hidden={['password_credentials', 'client_credentials'].includes(grantType)}
        tooltip={t('common.auth.state_tip')}
        label={'State'}
        name={[AUTH_ENUM.OAUTH2, 'state']}
      >
        <VarInput hasBorder />
      </Form.Item>
      <Form.Item
        tooltip={t('common.auth.client_auth_tip')}
        initialValue={'header'}
        label={'Client Authentication'}
        name={[AUTH_ENUM.OAUTH2, 'client_authentication']}
      >
        <Select options={AUTH_OAUTH2_AUTHENTICATION || []} />
      </Form.Item>
      <GhostCollapse
        style={{ marginTop: 24 }}
        items={[
          {
            key: 'oauth2-more',
            label: <MoreTipContainer>{t('common.auth.more')}</MoreTipContainer>,
            children: (
              <>
                <Form.Item
                  tooltip={t('common.auth.refresh_token_tip')}
                  label={'Refresh Token URL'}
                  name={[AUTH_ENUM.OAUTH2, 'refreshTokenUrl']}
                >
                  <VarInput hasBorder />
                </Form.Item>
                <SegmentedTabs
                  wrapClassName="oauth-segment"
                  options={segmentedOptions}
                  value={tabsValue}
                  onChange={(val) => setTabsValue(val as string)}
                />
              </>
            ),
          },
        ]}
      />
    </Oauth2Container>
  );
};

export default Oauth2;
