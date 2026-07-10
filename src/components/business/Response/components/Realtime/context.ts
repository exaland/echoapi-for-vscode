import { createContext } from 'react';

import { DirectionType } from '@/types/common';

type Props = {
  direction: DirectionType | '';
};

const Context = createContext<Props>({
  direction: '',
});

export default Context;
