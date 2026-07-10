import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Col, Divider, Flex, Row } from 'antd';

import aptTools from 'apipost-tools';
import classNames from 'classnames';
import {
  add,
  divide,
  get,
  has,
  isEmpty,
  isEqual,
  isNil,
  isPlainObject,
  isString,
  isUndefined,
  map,
  multiply,
  omit,
  some,
  subtract,
  sumBy,
  values,
} from 'lodash';

import { Tooltip } from '@/components/ui';
import IconFont from '@/components/ui/IconFont';
import CustomPopover from '@/components/ui/Popover';
import {
  HTTPS_TIME_ARRAY,
  HTTP_TIME_ARRAY,
  RESPONSE_CODE_DESC_MAP,
} from '@/constants/apis/response';
import useTheme from '@/hooks/useTheme';
import { useSystemConfig } from '@/store';
import { ApiSendResponseDataProxy, ApiSendingData } from '@/types/apis/send';
import {
  convertResponseBytes,
  convertResponseTime,
  download,
  hexToRGBA,
  toFixed,
} from '@/utils/common';
import { parseStreamToRaw } from '@/utils/parse';

import {
  CustomCodePopoverWrap,
  CustomPopoverWrap,
  CustomProxyWrap,
  CustomSizePopoverWrap,
  ResponseSizeWrap,
} from './style';

interface ResponseSizeProps {
  response?: ApiSendingData['response'];
  request?: ApiSendingData['request'];
  showProxy?: boolean;
  showIcon?: boolean;
  showDownload?: boolean;
  showLine?: boolean;
}

const ResponseSize: React.FC<ResponseSizeProps> = (props) => {
  const {
    response,
    request,
    showDownload = false,
    showIcon = true,
    showProxy = true,
    showLine = true,
  } = props || {};
  const { t } = useTranslation();
  const { themeToken } = useTheme();

  const systemConfig = useSystemConfig((state) => state.systemConfig);
  const { proxy: systemProxy } = systemConfig || {};

  const timings = response?.timings;
  const responseCode = response?.code;
  const originResponseSizeFormat = convertResponseBytes(response?.response_size || 0);
  const responseTime = response?.response_time;
  const responseProxy = response?.proxy;
  const requestProxy = request?.proxy;
  const formatTimings = response?.formatTimings;
  const formatSize = response?.formatSize;
  const network = response?.network;
  const isNewTimings = !isNil(response?.formatTimings);

  const handleDownload = () => {
    if (!response) return;

    const { mime_type, fit_for_show, stream, filename } = response;

    const rawHtml =
      !isUndefined(stream?.data) && isPlainObject(mime_type)
        ? parseStreamToRaw(stream?.data, mime_type, 'utf8')
        : '';

    const name = `${t('supplement.res_data')}.${mime_type?.ext}`;

    if (isString(fit_for_show) && fit_for_show === 'Monaco') {
      download(rawHtml, filename || name, mime_type?.mime);
      return;
    }

    const _bufferToRaw = aptTools.bufferToRaw(stream?.data, mime_type);
    const { buffer } = _bufferToRaw;

    stream?.data && (stream.data = Array.from(buffer) as unknown as ArrayBuffer);

    download(stream, filename || name, mime_type?.mime);
  };

  const computedProxyValue = (
    requestProxy: ApiSendResponseDataProxy | undefined,
    responseProxy: ApiSendResponseDataProxy | undefined
  ) => {
    if (responseProxy?.href) {
      return responseProxy?.href;
    }

    if (requestProxy?.host && requestProxy?.port) {
      return `${requestProxy?.host}:${requestProxy?.port}`;
    }

    return t('common.response_indicators.no_local');
  };

  const isValidValue = (value: any) => !isNil(value) && value !== 'undefined' && value !== '';
  const isValidArray = (value: string[]) =>
    some(value, (key) => has(network, key) && isValidValue(get(network, key) as string));

  const newProxyContent = () => {
    const firstLine =
      isValidArray(['HTTPVersion', 'LocalAddress', 'RemoteAddress']) &&
      isValidArray(['TLSProtocol', 'CipherName']);
    const secondLine =
      isValidArray(['TLSProtocol', 'CipherName']) &&
      isValidArray(['Certificate', 'Issuer', 'ValidUntil']);
    return (
      <CustomProxyWrap gap={8} style={{ width: 300 }}>
        <Flex className="icon-wrapper">
          <IconFont type="icon-network" />
        </Flex>
        <Flex gap={4} className="right-wrapper" style={{ width: 0 }} flex={1} vertical>
          <Flex justify="space-between" style={{ width: '100%' }} className="name" gap={8}>
            <span>Network</span>
          </Flex>
          {isValidValue(get(network, 'HTTPVersion')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={8}>
              <span>HTTP Version</span>
              <span>{get(network, 'HTTPVersion')}</span>
            </Flex>
          )}
          {isValidValue(get(network, 'LocalAddress')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={8}>
              <span>Local Address</span>
              <span>{get(network, 'LocalAddress')}</span>
            </Flex>
          )}
          {isValidValue(get(network, 'RemoteAddress')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={8}>
              <span>Remote Address</span>
              <span>{get(network, 'RemoteAddress')}</span>
            </Flex>
          )}
          {firstLine && <Divider style={{ margin: '8px 0' }} />}
          {isValidValue(get(network, 'TLSProtocol')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={8}>
              <span>TLS Protocol</span>
              <span>{get(network, 'TLSProtocol')}</span>
            </Flex>
          )}
          {isValidValue(get(network, 'CipherName')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={8}>
              <span>Cipher Name</span>
              <span>{get(network, 'CipherName')}</span>
            </Flex>
          )}
          {secondLine && <Divider style={{ margin: '8px 0' }} />}
          {isValidValue(get(network, 'Certificate')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={4}>
              <span>Certificate CN</span>
              <span>{get(network, 'Certificate')}</span>
            </Flex>
          )}
          {isValidValue(get(network, 'Issuer')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={4}>
              <span>Issuer CN</span>
              <span>{get(network, 'Issuer')}</span>
            </Flex>
          )}
          {isValidValue(get(network, 'ValidUntil')) && (
            <Flex justify="space-between" style={{ width: '100%' }} className="desc" gap={4}>
              <span>Valid Until</span>
              <span>{get(network, 'ValidUntil')}</span>
            </Flex>
          )}
        </Flex>
      </CustomProxyWrap>
    );
  };

  const proxyContent = (
    <CustomPopoverWrap style={{ width: 180 }}>
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Flex justify="space-between" className="response-size-title">
            <span>{t('common.response_indicators.network')}</span>
          </Flex>
        </Col>
        <Col span={24}>
          <Flex flex={1} justify="space-between">
            <span>{t('common.response_indicators.local')}</span>
            <span>{computedProxyValue(requestProxy, responseProxy)}</span>
          </Flex>
        </Col>
      </Row>
    </CustomPopoverWrap>
  );

  const timeContentKeyMap = {
    prepare: 'Prepare',
    socketInitialization: 'Socket Initialization',
    dnsLookup: 'DNS Lookup',
    tcpHandshake: 'TCP Handshake',
    sslHandshake: 'SSL Handshake',
    waiting: 'Waiting(TTFB)',
    download: 'Download',
    process: 'Process',
  };

  const timeContentList = useMemo(() => {
    if (!formatTimings) return [];
    const total = sumBy(values(omit(formatTimings, ['total'])), 'duration');
    const left = Number(toFixed(divide(formatTimings?.prepare.duration, total)));
    const right = Number(toFixed(divide(formatTimings?.process?.duration, total)));

    const mapArr = has(formatTimings, 'sslHandshake') ? HTTPS_TIME_ARRAY : HTTP_TIME_ARRAY;

    const { res } = mapArr.reduce(
      (prev: { res: any[]; tempTotal: number }, key) => {
        const width = multiply(
          Number(toFixed(divide(get(formatTimings, key)?.duration, total))),
          100
        );
        if (isEqual(key, 'prepare')) {
          prev.res.push({
            key,
            name: get(timeContentKeyMap, key),
            lineLeftSize: multiply(left, 100),
            lineRightSize: subtract(100, multiply(right, 100)),
            width,
            marginLeft: 0,
          });
        } else if (isEqual(key, 'process')) {
          prev.res.push({
            key,
            name: get(timeContentKeyMap, key),
            lineLeftSize: multiply(left, 100),
            lineRightSize: subtract(100, multiply(right, 100)),
            width,
            marginLeft: subtract(100, width),
          });
        } else {
          prev.res.push({
            key,
            name: get(timeContentKeyMap, key),
            lineLeftSize: multiply(left, 100),
            lineRightSize: subtract(100, multiply(right, 100)),
            width,
            marginLeft: multiply(divide(prev.tempTotal, total), 100),
          });
        }
        prev.tempTotal = add(prev.tempTotal, get(formatTimings, key)?.duration);
        return prev;
      },
      { res: [], tempTotal: 0 }
    );
    return res;
  }, [formatTimings, timeContentKeyMap]);

  const responseCodeDesc = useMemo(() => {
    if (responseCode) {
      return get(RESPONSE_CODE_DESC_MAP, responseCode);
    }
    return { name: '', desc: '' };
  }, [responseCode]);

  const responseSizeFormat = useMemo(() => {
    if (!formatSize) return {};
    const resSize = convertResponseBytes(add(formatSize.responseHeaders, formatSize.responseBody));
    const resHeaderSize = convertResponseBytes(formatSize.responseHeaders);
    const resBodySize = convertResponseBytes(formatSize.responseBody);
    const reqSize = convertResponseBytes(add(formatSize.requestHeaders, formatSize.requestBody));
    const reqHeaderSize = convertResponseBytes(formatSize.requestHeaders);
    const reqBodySize = convertResponseBytes(formatSize.requestBody);
    const resUnCompressSize = convertResponseBytes(formatSize.uncompressedResponseBody || 0);
    return {
      responseSize: `${resSize.convertedValue}${resSize.unit}`,
      responseHeaders: `${resHeaderSize.convertedValue}${resHeaderSize.unit}`,
      responseBody: `${resBodySize.convertedValue}${resBodySize.unit}`,
      requestSize: `${reqSize.convertedValue}${reqSize.unit}`,
      requestHeaders: `${reqHeaderSize.convertedValue}${reqHeaderSize.unit}`,
      requestBody: `${reqBodySize.convertedValue}${reqBodySize.unit}`,
      responseUnCompress: `${resUnCompressSize.convertedValue}${resUnCompressSize.unit}`,
    };
  }, [formatSize]);

  const responseSizeContent = (
    <CustomSizePopoverWrap vertical style={{ width: 300 }}>
      <Flex gap={4} vertical>
        <Flex style={{ width: '100%' }} gap={8}>
          <Flex className="icon-wrapper">
            <IconFont type="icon-download" />
          </Flex>
          <Flex flex={1} gap={4} vertical>
            <Flex justify="space-between" className="name" gap={4}>
              <span>Response Size</span>
              <span>{responseSizeFormat?.responseSize}</span>
            </Flex>
            <Flex justify="space-between" className="desc" gap={4}>
              <span>Headers</span>
              <span>{responseSizeFormat?.responseHeaders}</span>
            </Flex>
            <Flex justify="space-between" className="desc" gap={4}>
              <span>Body</span>
              <span>{responseSizeFormat?.responseBody}</span>
            </Flex>
            {has(formatSize, 'uncompressedResponseBody') && (
              <Flex justify="space-between" className="desc" gap={4}>
                <span>Uncompressed</span>
                <span>{responseSizeFormat?.responseUnCompress}</span>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Divider style={{ margin: '8px 0' }} />
        <Flex style={{ width: '100%' }} gap={8}>
          <Flex className="icon-wrapper request">
            <IconFont rotate={180} type="icon-download" />
          </Flex>
          <Flex flex={1} gap={4} vertical>
            <Flex justify="space-between" className="name" gap={4}>
              <span>Request Size</span>
              <span>{responseSizeFormat?.requestSize}</span>
            </Flex>
            <Flex justify="space-between" className="desc" gap={4}>
              <span>Headers</span>
              <span>{responseSizeFormat?.requestHeaders}</span>
            </Flex>
            <Flex justify="space-between" className="desc" gap={4}>
              <span>Body</span>
              <span>{responseSizeFormat?.requestBody}</span>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </CustomSizePopoverWrap>
  );

  const responseCodeContent = (
    <CustomCodePopoverWrap gap={8} style={{ width: 240 }}>
      <Flex
        className={classNames('icon-code', { success: String(responseCode).charAt(0) === '2' })}
      >
        <IconFont
          type={String(responseCode).charAt(0) === '2' ? 'icon-row-checked' : 'icon-client-close'}
        />
      </Flex>
      <Flex gap={4} vertical>
        <Flex className="name" gap={4}>
          <span>{responseCode}</span>
          <span>{responseCodeDesc?.name}</span>
        </Flex>
        <Flex className="desc" wrap="wrap">
          {responseCodeDesc?.desc}
        </Flex>
      </Flex>
    </CustomCodePopoverWrap>
  );

  const newTimeContent = (
    <CustomPopoverWrap style={{ width: 380 }}>
      <Flex align="flex-start" gap={4}>
        <IconFont
          style={{ marginTop: 2, color: 'var(--font-title-color)', fontSize: '14px' }}
          type="icon-response-time"
        />
        <Flex flex={1} vertical>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Flex justify="space-between" className="new-response-size-title">
                Response Time
                <span>{`${toFixed(formatTimings?.total?.duration || 0)}ms`}</span>
              </Flex>
            </Col>
          </Row>

          {map(timeContentList, ({ key, name, lineLeftSize, lineRightSize, width, marginLeft }) => (
            <Row className={classNames(key, { empty: isEqual(width, 0) })} gutter={[8, 8]}>
              <Col style={{ lineHeight: '26px' }} span={8}>
                {name}
              </Col>
              <Col style={{ height: 24 }} span={12}>
                <div className="progress">
                  <div style={{ left: `${lineLeftSize}%` }} className="progress-left"></div>
                  <div
                    style={{ width: `${width}%`, marginLeft: `${marginLeft}%` }}
                    className={classNames('progress-content', key)}
                  ></div>
                  <div style={{ left: `${lineRightSize}%` }} className="progress-right"></div>
                </div>
              </Col>
              <Col style={{ textAlign: 'right', lineHeight: '26px' }} span={4}>
                {isEqual(width, 0) ? 'Cache' : `${toFixed(get(formatTimings, key)?.duration)}ms`}
              </Col>
            </Row>
          ))}
        </Flex>
      </Flex>
    </CustomPopoverWrap>
  );

  const timeContent = (
    <CustomPopoverWrap style={{ width: 240 }}>
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Flex justify="space-between" className="response-size-title">
            <span>{t('common.response_indicators.event')}</span>
            <span>{t('common.response_indicators.use_time')}</span>
          </Flex>
        </Col>
        {!isNil(timings?.request) && (
          <Col span={24}>
            <Flex flex={1} justify="space-between">
              <span>Request</span>
              <span className="time">{toFixed(timings.request)}ms</span>
            </Flex>
          </Col>
        )}

        {!isNil(timings?.socket) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>Socket</span>
              <span className="time">{toFixed(timings.socket)}ms</span>
            </Flex>
          </Col>
        )}
        {!isNil(timings?.lookup) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>Lookup</span>
              <span className="time">{toFixed(timings.lookup)}ms</span>
            </Flex>
          </Col>
        )}

        {!isNil(timings?.connect) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>Connect</span>
              <span className="time">{toFixed(timings.connect)}ms</span>
            </Flex>
          </Col>
        )}

        {!isNil(timings?.secure_connect) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>SecureConnect</span>
              <span className="time">{toFixed(timings.secure_connect)}ms</span>
            </Flex>
          </Col>
        )}

        {!isNil(timings?.response) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>Response</span>
              <span className="time">{toFixed(timings.response)}ms</span>
            </Flex>
          </Col>
        )}

        {!isNil(timings?.end) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>End</span>
              <span className="time">{toFixed(timings.end)}ms</span>
            </Flex>
          </Col>
        )}
        {!isNil(timings?.done) && (
          <Col span={24}>
            <Flex justify="space-between">
              <span>Done</span>
              <span className="time">{toFixed(timings.done)}ms</span>
            </Flex>
          </Col>
        )}
      </Row>
    </CustomPopoverWrap>
  );

  const responseTimeStr = useMemo(() => {
    return convertResponseTime(responseTime);
  }, [responseTime]);

  return (
    <ResponseSizeWrap gap={8} align="center">
      {responseCode !== 0 && (
        <>
          {responseCode && (
            <Flex>
              <CustomPopover content={responseCodeContent}>
                <span
                  style={{
                    padding: '0px 8px',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid',
                    borderColor:
                      String(responseCode).charAt(0) === '2'
                        ? hexToRGBA('#26CEA4', 0.15)
                        : hexToRGBA('#ff583e', 0.15),
                    background:
                      String(responseCode).charAt(0) === '2'
                        ? hexToRGBA('#26CEA4', 0.1)
                        : hexToRGBA('#ff583e', 0.1),
                    color:
                      String(responseCode).charAt(0) === '2'
                        ? themeToken.colorSuccess
                        : themeToken.colorError,
                  }}
                >
                  {responseCode}
                </span>
              </CustomPopover>
            </Flex>
          )}

          <Flex gap={6} align="center">
            {responseTime && (
              <>
                <svg
                  width="4"
                  height="4"
                  viewBox="0 0 4 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="2" cy="2" r="2" fill="var(--check-box-border-color)" />
                </svg>
                {!isEmpty(timings) ? (
                  <CustomPopover content={isNewTimings ? newTimeContent : timeContent}>
                    <span className="cur-pointer">{responseTimeStr}</span>
                  </CustomPopover>
                ) : (
                  <span>{responseTimeStr}</span>
                )}
              </>
            )}
          </Flex>

          {response?.response_size && (
            <>
              <svg
                width="4"
                height="4"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="2" cy="2" r="2" fill="var(--check-box-border-color)" />
              </svg>
              <Flex>
                <Tooltip title={t('common.response_indicators.size')}></Tooltip>
                <CustomPopover
                  overlayInnerStyle={{ padding: isNewTimings ? '16px 20px' : '6px 8px' }}
                  content={
                    isNewTimings ? responseSizeContent : t('common.response_indicators.size')
                  }
                >
                  <span>{`${originResponseSizeFormat.convertedValue}${originResponseSizeFormat.unit}`}</span>
                </CustomPopover>
              </Flex>
              <svg
                width="4"
                height="4"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="2" cy="2" r="2" fill="var(--check-box-border-color)" />
              </svg>
            </>
          )}
        </>
      )}

      {showProxy && (
        <>
          <CustomPopover content={isNewTimings ? newProxyContent : proxyContent}>
            <IconFont
              type="icon-network"
              className="cur-pointer"
              style={{
                color: systemProxy === 2 ? themeToken.fontContentColor : themeToken.colorSuccess,
              }}
            />
          </CustomPopover>
        </>
      )}
      {showLine && <svg width="1" height="10" viewBox="0 0 1 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.5" y1="2.18556e-08" x2="0.5" y2="10" stroke="var(--check-box-border-color)" />
      </svg>}

      {showDownload ? (
        <Tooltip title={t('response.download_tip')}>
          <IconFont
            style={{ fontSize: 14 }}
            className="cur-pointer"
            onClick={handleDownload}
            type="icon-download-response"
          />
        </Tooltip>
      ) : (
        showIcon &&
        (String(responseCode).charAt(0) === '2' ? (
          <IconFont type="icon-checked" style={{ color: themeToken.colorSuccess }} />
        ) : null)
      )}
    </ResponseSizeWrap>
  );
};

export default memo(ResponseSize);
