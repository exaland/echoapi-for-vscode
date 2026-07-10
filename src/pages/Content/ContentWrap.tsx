import { FC, FunctionComponent, memo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import { SuspenseContent } from '@/components/business';
import { updateOpensItem } from '@/events/apis/opens';
import { useApis } from '@/store';
import { ApiDetailsData, ApisData } from '@/types/apis/api';

interface Props {
  targetId: string;
  contentType?: string;
  activeContentType?: string | number;
  element: FunctionComponent<{ apisData: any; onApisDataChange: any }>;
}

const ContentWrap: FC<Props> = memo((props) => {
  const { targetId, contentType, activeContentType } = props;

  const prevApiDataRef = useRef<ApiDetailsData | null>(null);

  const apisData = useApis((state) => {
    // Only update content under current ContentWrap
    if (activeContentType !== contentType && prevApiDataRef.current) {
      return prevApiDataRef.current;
    }

    const targetData = state.opensApiDetailsData[targetId] || state.apiBaseData[targetId];
    prevApiDataRef.current = targetData;

    return targetData;
  });

  const onApisDataChange = useMemoizedFn((data: Partial<ApisData>) => {
    updateOpensItem(data);
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

export default ContentWrap;
