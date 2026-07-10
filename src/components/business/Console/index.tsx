import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { size } from 'lodash';

import Empty from '@/components/ui/Empty';

import Content from './Content';
import { ConsoleContentProps } from './types';

import { ConsoleContainer, ConsoleWrapper } from './style';

const Console = memo(({ consoleList = [] }: ConsoleContentProps) => {
  const { t } = useTranslation();
  return (
    <ConsoleWrapper>
      <ConsoleContainer>
        {size(consoleList) <= 0 ? (
          <Empty description={t('supplement.no_console')} />
        ) : (
          <Content consoleList={consoleList} />
        )}
      </ConsoleContainer>
    </ConsoleWrapper>
  );
});

export default Console;
