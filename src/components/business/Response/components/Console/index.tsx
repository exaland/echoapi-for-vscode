import { FC, memo } from 'react';

import Console from '@/components/business/Console';
import { useApis } from '@/store';
import { ApiSendingData } from '@/types/apis/send';

import { ResponseConsoleContainer } from './style';

interface Props {
  sendingData?: Partial<ApiSendingData>;
}

const ResponseConsole: FC<Props> = memo(({ sendingData }) => {
  const coverApiSendingConsole = useApis((state) => state.coverApiSendingConsole);

  const handleClear = () => {
    coverApiSendingConsole({ consoleList: [], target_id: sendingData?.target_id });
  };

  return (
    <ResponseConsoleContainer>
      <Console consoleList={sendingData?.consoleList || []} onClear={handleClear} />
    </ResponseConsoleContainer>
  );
});

export default ResponseConsole;
