import { create, devtools } from '@/store/utils';

type Pool = {
  [k: string]: {
    status: 'connect' | 'connecting' | 'disconnect';
    socketRes: any[];
    responseData: any;
  };
};
type State = {
  websocket2ConnectionPool: Pool;
  aborts: {
    [k: string]: any;
  };
};

type Action = {
  updateWebsocket2ConnectionPool: (config: Pool) => void;
  updateWebsocket2aborts: (config: Pool) => void;
};

const useApisWebsocket2 = create<State & Action>()(
  devtools(
    (set) => ({
      websocket2ConnectionPool: {},
      aborts: {},
      /** update websocket connection pool */
      updateWebsocket2ConnectionPool: (config) => {
        set({
          websocket2ConnectionPool: { ...config },
        });
      },
      updateWebsocket2aborts: (config) => {
        set({
          aborts: { ...config },
        });
      },
    }),
    { name: 'useApisWebsocket2' }
  )
);

export default useApisWebsocket2;
