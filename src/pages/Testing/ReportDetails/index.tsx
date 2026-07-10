import React from 'react';
import { ReportDetailsContainer } from './style';
import { TestingReportList } from '@/types/testing/res';
import TestingMain from '@/pages/Testing/Main';

type ReportDetailsProps = {
  reportDetails: TestingReportList;
}

const ReportDetails = ({ reportDetails }: ReportDetailsProps) => {
  return (
    <ReportDetailsContainer>
      <TestingMain is_report={true} testingSendingData={{
        sendStatus: 'sendOver',
        requestList: reportDetails?.requestList || [],
        complete: reportDetails?.complete || {},
      }} testingConfig={reportDetails.testingConfig} eventList={[]} eventAllCount={reportDetails?.eventAllCount} />
    </ReportDetailsContainer>
  )
}

export default ReportDetails