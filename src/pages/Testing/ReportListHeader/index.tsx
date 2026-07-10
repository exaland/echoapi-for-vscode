import { Button, Flex } from 'antd';
import IconFont from '@/components/ui/IconFont';
import { ReportListHeaderWrapper } from './style';

type TestingHeaderProps = {
  folderName : string;
  setShowReportList:(val:boolean)=>void;
}

const ReportListHeader = ({folderName, setShowReportList}:TestingHeaderProps) => {

  return (
    <ReportListHeaderWrapper>
      <Flex align='center' gap={6}>
        <IconFont style={{fontSize: 20}} type="icon-back1" onClick={() => setShowReportList(false)} />
        <div className="folder-name">{folderName}</div>
      </Flex>
    </ReportListHeaderWrapper>
  )
}
export default ReportListHeader;