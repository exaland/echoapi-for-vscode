import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {Flex, SegmentedProps, Select, message } from 'antd';

import { useSafeState } from 'ahooks';
import classNames from 'classnames';
import { find, forEach, isArray, isPlainObject, map } from 'lodash';

import SegmentedTabs from '@/components/business/SegmentedTabs';
import IconFont from '@/components/ui/IconFont';
import { BaseResponse } from '@/types/apis/response';
import { ApiSendingData } from '@/types/apis/send';
import { copyStringToClipboard } from '@/utils/common';
import { parseStreamToRaw } from '@/utils/parse';

import { RAW_ENCODE, RESPONSE_RESULT_TABS_LIST, RESPONSE_TYPE } from './constants';

import { ResponseResultWrap } from './style';

interface Props {
  rawHtml?: string;
  mode?: string;
  data?: ApiSendingData['response'];
  defaultRawEncode?: string;
  html?: string | null;
  resultIncludesTabs?: string[];
  onChange?: (value: BaseResponse) => void;
  responseData?: BaseResponse;
  saveExampleVisible?: boolean;
  warpVisible?: boolean;
  saveSocketMessageDom?: any;
  setMode?: (value: string) => void;
}

const ResponseResult = forwardRef((props: Props, ref) => {
  const { t } = useTranslation();
  const {
    resultIncludesTabs = ['beautify', 'native', 'preview', 'visualization'],
    defaultRawEncode,
    data,
    rawHtml,
    warpVisible = true,
    saveSocketMessageDom = null,
    setMode,
  } = props || {};

  const [rawEncode, setRawEncode] = useSafeState(defaultRawEncode || 'utf8');
  const [rawType, setRawType] = useSafeState<string>('');
  const [tabsValue, setTabsValue] = useSafeState<string | number>();
  const [warp, setWarp] = useSafeState(true);

  useEffect(() => {
    setRawType(data?.mime_type.ext || 'json');
  }, [data?.mime_type.ext]);

  useImperativeHandle(ref, () => {
    return {
      setTabsValue,
    };
  });

  const result = useMemo(() => {
    const resultList: any = [];
    forEach(resultIncludesTabs, (key: string) => {
      const item = find(RESPONSE_RESULT_TABS_LIST, (item) => item.value === key);
      if (item) {
        resultList.push(item);
      }
    });

    const key = resultList[0]?.value;

    setTabsValue(key);

    return resultList;
  }, []);

  const parsedRawHtml = useMemo(() => {
    if (data?.stream?.data && isPlainObject(data?.mime_type)) {
      if (rawType === 'auto') {
        return parseStreamToRaw(data?.stream?.data, data?.mime_type, rawEncode);
      } else {
        const mime_type = RESPONSE_TYPE?.find((e) => e.ext === rawType);
        return parseStreamToRaw(data?.stream?.data, mime_type || data?.mime_type, rawEncode);
      }
    }

    return '';
  }, [data?.stream?.data, data?.mime_type, rawEncode, rawType]);

  const beautifyProps = {
    mode: rawType,
    monacoOptions: warp ? {} : { wordWrap: 'off' },
  };

  const segmentedOptions =
    (isArray(result) &&
      map(result, (item) => ({
        label: item.label,
        key: item.value,
        value: item.value,
        children: (
          <item.children
            {...props}
            key={item.value}
            rawEncode={rawEncode}
            rawHtml={parsedRawHtml || rawHtml}
            {...beautifyProps}
          />
        ),
      }))) ||
    [];

  const handleOptionsChange: SegmentedProps['onChange'] = (value) => {
    setTabsValue(value);
  };

  const handleCopy = () => {
    if (!rawHtml) {
      message.error(t('supplement.clipboard_error'));
      return;
    }

    copyStringToClipboard(rawHtml, () => message.success(t('supplement.clipboard_success')));
  };

  useEffect(() => {
    setMode?.(rawType);
  }, [rawType]);
  return (
    <ResponseResultWrap>
      <SegmentedTabs
        options={segmentedOptions}
        value={tabsValue}
        onChange={handleOptionsChange}
        wrapClassName="response-result-tabs-wrap"
        tabBarExtraContent={
          <Flex className="tab-bar-extra-content-wrap" gap={8}>
            <Select
              // style={{ width: 110 }}
              options={RESPONSE_TYPE.map(({ label, ext }) => ({
                label,
                value: ext,
              }))}
              popupMatchSelectWidth={false}
              value={rawType || 'json'}
              onChange={(newVal: string) => {
                if (newVal === 'auto') {
                  setRawType(data?.mime_type?.ext || 'json');
                } else {
                  setRawType(newVal);
                }
              }}
            />
            <Select
              // style={{ width: 110 }}
              options={Object.keys(RAW_ENCODE).map((key: string) => ({
                label: key,
                value: RAW_ENCODE[key],
              }))}
              popupMatchSelectWidth={false}
              value={rawEncode || 'utf8'}
              onChange={(newVal: string) => setRawEncode(newVal)}
            />
            <IconFont type="icon-copy" className="icon-copy" onClick={handleCopy} />
            {warpVisible && (
              <IconFont
                type="icon-huanhang"
                className={classNames('icon-copy', warp && 'wrap-show')}
                onClick={() => setWarp(!warp)}
              />
            )}
            {saveSocketMessageDom}
          </Flex>
        }
      />
    </ResponseResultWrap>
  );
});

const PureResponseResult = memo(ResponseResult);

export default PureResponseResult;
