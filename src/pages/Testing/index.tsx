import React, { useMemo, useState } from 'react';
import { TestingContainer } from './style';
import Header from './Header';
import Main from './Main';
import produce from 'immer';
import useTesting from '@/store/useTesting';
import ReportListHeader from './ReportListHeader';
import ReportList from './ReportList';
import { STATUS_CODE } from '@/constants/common';
import { message } from 'antd';


const Testing = () => {
  const testingConfig = useTesting(store => store?.testingConfig);
  const testingSendingData = useTesting(store => store?.testingSendingData);
  const testingName = useTesting(store => store?.testingName);
  const updateTestingSendingData = useTesting(store => store?.updateTestingSendingData);
  const eventList = useTesting(store => store?.eventList);
  const showReportList = useTesting(store => store?.showReportList);
  const updateShowReportList = useTesting(store => store?.updateShowReportList);
  
  const onRunClick = () => {
    switch (testingSendingData.sendStatus) {
      case 'initial':
        if(eventList.filter(i=>i?.enabled === STATUS_CODE.ENABLE).length <= 0){
          message.error('No http request exists in the directory. Create an http request first.')
          return;
        }

        // Save current configuration
        window?.vscode.postMessage({
          action: 'saveFolderTestData',
          data: {
            config: testingConfig
          }
        });

        // Set sending status
        updateTestingSendingData({
          sendStatus: 'sending',
          complete: {},
          requestList: []
        });

        window?.vscode.postMessage({
          action: 'sendEventList',
          data: {
            settings: testingConfig,
            event_list: eventList
          }
        });
        break;
      case 'sending':
        // Stop sending
        const newTestingSendingData = produce(testingSendingData, (draft) => {
          draft.sendStatus = 'initial';
        });
        updateTestingSendingData(newTestingSendingData);

        window?.vscode.postMessage({
          action: 'stopSendEventList'
        });
        break;
      case 'sendOver':
        // Clear results and return to initial state
        const overTestingSendingData = produce(testingSendingData, (draft) => {
          draft.sendStatus = 'initial';
          draft.complete = {};
          draft.requestList = [];
        });
        updateTestingSendingData(overTestingSendingData);

        // Refresh event list
        window?.vscode.postMessage({
          action: 'refreshEventList',
        });

        break;
      default:
        if(eventList.filter(i=>i?.enabled === STATUS_CODE.ENABLE).length <= 0){
          message.error('No http request exists in the directory. Create an http request first.')
          return;
        }
        // Save current configuration
        window?.vscode.postMessage({
          action: 'saveFolderTestData',
          data: {
            config: testingConfig
          }
        });

        // Set sending status
        updateTestingSendingData({
          sendStatus: 'sending',
          complete: {},
          requestList: []
        });

        window?.vscode.postMessage({
          action: 'sendEventList',
          data: {
            settings: testingConfig,
            event_list: eventList
          }
        });
        break;
    }
  };

  const eventCount = useMemo(() => {
    return eventList.filter(i => i.enabled === STATUS_CODE.ENABLE).length;
  }, [eventList]);

  return (
    <TestingContainer>
      {showReportList ?
        <>
          <ReportListHeader folderName={testingName} setShowReportList={(val) => {
            updateShowReportList(val);
          }} />
          <ReportList />
        </>
        :
        <>
          <Header folderName={testingName} onRunClick={onRunClick} setShowReportList={(val) => {
            updateShowReportList(val);
          }} />
          <Main eventAllCount={eventCount} testingSendingData={testingSendingData} testingConfig={testingConfig} eventList={eventList} />
        </>
      }
    </TestingContainer>
  );
};

export default Testing;
