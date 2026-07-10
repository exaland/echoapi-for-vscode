import { ApiSendResponseData } from '@/types/apis/send';

export type ConsoleContentProps = {
  consoleList: ApiSendResponseData['console'];
  onClear?: () => void;
};
