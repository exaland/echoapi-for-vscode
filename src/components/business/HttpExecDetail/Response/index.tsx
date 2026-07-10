import { useTranslation } from 'react-i18next';

import Atools from 'apipost-tools';
import dayjs from 'dayjs';
import { isEmpty, size } from 'lodash';

import Console from '@/components/business/Console';
import LineTabs from '@/components/business/LineTabs';
import Empty from '@/components/ui/Empty';
import PdfView from '@/components/ui/PdfView';
import Tooltip from '@/components/ui/Tooltip';
import { ApiSendResponseDataRequest, ApiSendResponseDataResponse, ApiSendResponseDataResponseArrCookiesItem } from '@/types/apis/send';
import { EditFormat } from '@/utils/common';

import { HttpExecDetailProps } from '..';
import BasicTable from '../../BasicTable';
import NewJsonView from '../../NewJsonView';
import { formatObjectToArrayKeyValue } from '../utils';

import { ResponseWrapper, EmptyWrapper } from './style';
import { handleResponseConsole } from '@/utils/apis';
import { InvalidUrl } from '../InvalidUrl';

type HeaderDataSource = {
  key: string;
  value: string;
};

const Response = ({ httpExecDetail }: HttpExecDetailProps) => {
  const { t } = useTranslation();
  const { response={}, request }:{ response: ApiSendResponseDataResponse; request: ApiSendResponseDataRequest } = httpExecDetail || {};

  const headerList = formatObjectToArrayKeyValue(response.headers);

  const renderItem = (text: string) => {
    return (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    );
  };

  const headerColumns = [
    {
      width: '50%',
      title: t('supplement.key_v'),
      ellipsis: true,
      dataIndex: 'key',
      render: (text: string) => renderItem(text),
    },
    {
      width: '50%',
      title: t('supplement.value'),
      ellipsis: true,
      dataIndex: 'value',
      render: (text: string) => renderItem(text),
    },
  ];

  const cookieColumns = [
    {
      width: 100,
      title: 'name',
      dataIndex: 'key',
      render: (_: any, rowData: any) => renderItem(rowData.key || rowData.name),
    },
    {
      width: 100,
      title: 'value',
      dataIndex: 'value',
      render: (text: string) => renderItem(text),
    },
    {
      width: 100,
      title: 'httpOnly',
      dataIndex: 'httpOnly',
      render: (text: boolean) => renderItem(text ? 'true' : 'false'),
    },
    {
      width: 100,
      title: 'domain',
      dataIndex: 'domain',
      render: (text: string) => renderItem(text),
    },
    {
      width: 100,
      title: 'expires',
      dataIndex: 'expires',
      render: (text: string) => renderItem(dayjs(text).format('YYYY-MM-DD HH:mm:ss')),
    },
    {
      width: 100,
      title: 'path',
      dataIndex: 'path',
      render: (text: string) => renderItem(text),
    },
    {
      width: 100,
      title: 'secure',
      dataIndex: 'secure',
      render: (text: boolean) => renderItem(text ? 'true' : 'false'),
    },
  ];

  const responseBody = () => {
    const { mime_type, stream, body } = response || {};
    if (response?.response_size / 1024 / 1024 > 5) {
      return (
        <EmptyWrapper>
          <Empty description={t('supplement.file_big')} />
        </EmptyWrapper>
      );
    }
    
    const { raw: rawBody, base64 } =
      (stream?.data && Atools.bufferToRaw(stream?.data || '', mime_type)) || {};

    const base64Body = base64;

    if (!rawBody && !base64Body) {
      return (
        <EmptyWrapper>
          <Empty description={t('supplement.no_data')} />
        </EmptyWrapper>
      );
    }

    return (
      <>
        {response?.fit_for_show === 'Monaco' ? (
          <div style={{ height: 600, width: '100%' }}>
            <NewJsonView value={EditFormat(rawBody)?.value || ''} />
          </div>
        ) : response?.fit_for_show === 'Image' ? (
          <div style={{ width: 300 }}>
            <img src={body || base64Body} style={{ maxWidth: '100%' }} />
          </div>
        ) : response?.fit_for_show === 'Pdf' ? (
          <PdfView file={body || base64Body} />
        ) : (
          <EmptyWrapper>
            <Empty description={t('supplement.no_view')} />
          </EmptyWrapper>
        )}
      </>
    );
  };


  const responseConsole = () => {
    const consoleList = handleResponseConsole(httpExecDetail.console);
    return <Console consoleList={consoleList} />;
  };

  const items = [
    {
      key: '1',
      label: t('supplement.res_body'),
      children:  isEmpty(response) || response?.code === 0 ?
      <EmptyWrapper>
      <InvalidUrl url={request?.url} />
      </EmptyWrapper>
      : 
      responseBody()
      ,
    },
    {
      key: '2',
      label: t('supplement.res_header'),
      children: size(headerList) ? (
        <BasicTable<HeaderDataSource>
          scroll={{ y: 300 }}
          bordered
          showHeader={false}
          rowKey="value"
          dataSource={headerList}
          columns={headerColumns}
        />
      ) : (
        <EmptyWrapper>
        <Empty description={t('supplement.no_data')} />
        </EmptyWrapper>
      ),
      countParams: {
        dataSource: headerList,
      },
    },
    {
      key: '3',
      label: t('supplement.res_cookie'),
      children: size(response.arr_cookies) ? (
        <BasicTable<ApiSendResponseDataResponseArrCookiesItem>
          scroll={{ x: size(response.arr_cookies) ? 300 : 0, y: 300 }}
          bordered
          rowKey="name"
          dataSource={response.arr_cookies || []}
          columns={cookieColumns}
        />
      ) : (
        <EmptyWrapper>
        <Empty description={t('supplement.no_data')} />
        </EmptyWrapper>
      ),
      countParams: {
        dataSource: response.arr_cookies || [],
      },
    },
    {
      key: '4',
      label: t('supplement.console'),
      children: responseConsole(),
    },
  ];
  return (
    <ResponseWrapper>
      <LineTabs items={items} />
    </ResponseWrapper>
  );
};

export default Response;
