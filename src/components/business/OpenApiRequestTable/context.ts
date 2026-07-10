import { createContext } from 'react';

type Props = {
  envId?: string;
};

const Context = createContext<Props>({
  envId: '',
});

export default Context;
