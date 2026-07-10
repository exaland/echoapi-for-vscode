import { Children, FC, useMemo } from 'react';

import { isArray, isPlainObject, keys, size } from 'lodash';

import { TabsHeaderCountContainer, TabsHeaderDotContainer } from './style';
import { Badge } from 'antd';

interface Props {
  dataSource?: any;
  showDot?: boolean;
  customCalcFun?: (dataSource: any) => number;
  label: any;
}

const HeaderCount: FC<Props> = ({ label, dataSource, showDot = false, customCalcFun }) => {
  const calcCount = useMemo(() => {
    if (showDot) return 0;

    if (customCalcFun) {
      return customCalcFun(dataSource);
    }

    if (isPlainObject(dataSource)) {
      const number = size(keys(dataSource));
      return number;
    }

    if (isArray(dataSource)) {
      return size(dataSource);
    }
  }, [dataSource, customCalcFun, showDot]);

  if (showDot) {
    return <>
      {label}
      <TabsHeaderDotContainer />
    </>;
  }

  return <TabsHeaderCountContainer>
    {calcCount && calcCount > 0 ? <Badge classNames={{
      root: 'tabs-count-badge-root',
      indicator: 'tabs-count-badge'
    }} count={calcCount} offset={[5, 5]}>
      {label}
    </Badge> : label}
  </TabsHeaderCountContainer>;
};

export default HeaderCount;
