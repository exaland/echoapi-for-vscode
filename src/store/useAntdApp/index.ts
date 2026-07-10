import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

import { create } from 'zustand';

type State = {
  message?: MessageInstance;
  notification?: NotificationInstance;
  modal?: Omit<ModalStaticFunctions, 'warn'>;
};

type Action = {
  updateAntdStaticFunctions: (staticFunctions: {
    message: MessageInstance;
    notification: NotificationInstance;
    modal: Omit<ModalStaticFunctions, 'warn'>;
  }) => void;
};

const useAntdApp = create<State & Action>()((set) => ({
  message: undefined,
  modal: undefined,
  notification: undefined,
  updateAntdStaticFunctions: (staticFunctions) =>
    set({
      message: staticFunctions.message,
      notification: staticFunctions.notification,
      modal: staticFunctions.modal,
    }),
}));

export default useAntdApp;
