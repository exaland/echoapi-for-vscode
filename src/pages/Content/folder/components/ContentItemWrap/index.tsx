import { FC, FunctionComponent, memo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { SuspenseContent } from '@/components/business';
import { updateApisActiveItem } from '@/events/apis/opens';
import { ApiDetailsData, ApisData } from '@/types/apis/api';

interface Props {
  apisData: ApiDetailsData;
  // onApisDataChange:(val:ApiDetailsData)=>void;
  contentType?: string;
  activeContentType?: string | number;
  element: FunctionComponent<{ apisData: ApisData; onApisDataChange: (param: ApiDetailsData) => void }>;
}

const ContentItemWrap: FC<Props> = memo((props) => {
  const { apisData } = props;

  const onApisDataChange = useMemoizedFn((data: Partial<ApisData>) => {
    updateApisActiveItem(data);
  });

  return (
    <SuspenseContent skeletonProps={{ paragraph: { rows: 6 } }}>
      <props.element
        key={apisData?.target_id}
        apisData={apisData}
        onApisDataChange={onApisDataChange}
      />
    </SuspenseContent>
  );
});

export default ContentItemWrap;
