import { FC, memo, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useMemoizedFn, useSafeState } from 'ahooks';
import produce from 'immer';
import { isEmpty, isEqual } from 'lodash';

import ResizablePanels from '@/components/business/ResizablePanels';
import ResponseResult from '@/components/business/ResponseResult';
import ResponseAssert from '@/components/business/ResponseAssert';
import ErrorContext from '@/components/business/Response/ErrorContext';
import Error from '@/components/business/Response/components/Error';
import { STATUS_CODE } from '@/constants/common';
import { useSystemConfig } from '@/store';
import { BaseResponse } from '@/types/apis/response';
import { ApiSendingData } from '@/types/apis/send';
import { ChangeFuncType, DirectionType } from '@/types/common';

import Context from './context';

import { RealtimeContainer } from './style';

const panelProps = {
  defaultSize: 50,
  minSize: 4,
  collapsible: true,
  collapsedSize: 4,
};

interface Props {
  resultIncludesTabs?: string[];
  sendingData?: Partial<ApiSendingData>;
  responseData: BaseResponse;
  onResponseDataChange: (value: BaseResponse) => void;
}

const Realtime: FC<Props> = memo((props) => {
  const { t } = useTranslation();
  const { resultIncludesTabs, sendingData, responseData, onResponseDataChange } = props || {};

  const { showError, errorMsg } = useContext(ErrorContext);

  const systemConfigTabDirection = useSystemConfig((state) => state.systemConfig?.tab_direction);

  const [curDirection, setCurDirection] = useSafeState<DirectionType>('horizontal');

  const responseResultRef = useRef<any>(null);
  const resizablePanelsRef = useRef<any>(null);

  useEffect(() => {
    if (!systemConfigTabDirection) return;

    if (systemConfigTabDirection === 1) {
      setCurDirection('horizontal');
    }

    if (systemConfigTabDirection === -1) {
      setCurDirection('vertical');
    }

    const size = panelProps.collapsedSize;
    resizablePanelsRef.current?.setPanelGroupLayout([100 - size, size]);
  }, [systemConfigTabDirection, resizablePanelsRef]);

  useEffect(() => {
    const { systemConfig } = useSystemConfig.getState();

    if (isEmpty(sendingData) || !isEqual(sendingData?.sendStatus, 'initial')) return;

    // according to system config, whether to show assertion and validation results by default
    if (isEqual(systemConfig.assertions_and_validation_results, STATUS_CODE.ENABLE)) {
      resizablePanelsRef.current?.resetLayout();
    } else {
      const size = panelProps.collapsedSize;
      resizablePanelsRef.current?.setPanelGroupLayout([100 - size, size]);
    }

    // for non-Monaco type, jump to preview
    if (!isEqual(sendingData?.response?.fit_for_show, 'Monaco')) {
      responseResultRef.current?.setTabsValue('preview');
      return;
    } else if (isEqual(systemConfig.send_after_auto_beautify, STATUS_CODE.ENABLE)) {
      // Auto-switch to "beautify" panel after sending based on system config

      responseResultRef.current?.setTabsValue('beautify');
    }
  }, [sendingData]);

  const handleResponseDataChange: ChangeFuncType<BaseResponse> = useMemoizedFn((key, newValue) => {
    const newResponseData = produce(responseData, (draft) => {
      draft![key] = newValue;
    });

    onResponseDataChange?.(newResponseData);
  });

  if (showError) {
    return <Error errorMessage={errorMsg || ''} />;
  }

  return (
    <RealtimeContainer>
      <ResizablePanels
        ref={resizablePanelsRef}
        panelGroupProps={{ direction: curDirection }}
        leftPanel={
          <ResponseResult
            ref={responseResultRef}
            resultIncludesTabs={resultIncludesTabs}
            rawHtml={sendingData?.response?.raw_body}
            data={sendingData?.response}
            html={sendingData?.visualizerHtml}
          />
        }
        leftPanelProps={{
          ...panelProps,
          collapseTitle: t('common.response_component.title'),
        }}
        rightPanel={
          <ResponseAssert
            sendingData={sendingData}
            responseDataExample={responseData?.example}
            responseDataIsCheckResult={responseData?.is_check_result}
            onChange={handleResponseDataChange}
          />
        }
        rightPanelProps={{
          ...panelProps,
          collapseTitle: t('common.test_component.title'),
        }}
        showRightCollapseBtn
      />
    </RealtimeContainer>
  );
});

export default Realtime;
