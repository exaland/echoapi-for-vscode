import { getMonacoVariable } from '@/utils/global';
import { useEffect } from 'react';

const useInitApp = () => {

  useEffect(() => {
      init();
  }, []);

  const init = async () => {
    // Address bar token
    try {
      // Inject monaco variable getter method
      window.getMonacoVariable = getMonacoVariable;
    } finally {
   
    }
  };

  return { };
};

export default useInitApp;
