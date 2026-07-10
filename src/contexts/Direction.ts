import { createContext } from 'react';

import { DirectionType } from '@/types/common';

type Props = {
  direction: DirectionType | '';
};

const DirectionContext = createContext<Props>({
  direction: '',
});

export default DirectionContext;
