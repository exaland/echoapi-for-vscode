import { FC, forwardRef, FunctionComponent, ReactNode, Ref, useEffect, useImperativeHandle } from 'react';

import { Flex, Segmented, SegmentedProps } from 'antd';

import { useSafeState } from 'ahooks';
import { isEqual, map } from 'lodash';

import useTheme from '@/hooks/useTheme';

import { SegmentedTabsContainer } from './style';

type Props = SegmentedProps & {
  ref?: Ref<HTMLDivElement> | undefined;
  options: Array<{ label: string | ReactNode; value: string; children: FunctionComponent | ReactNode | any }>;
  tabBarExtraContent?: ReactNode;
  destroyInactiveTabs?: boolean;
  wrapClassName?: string;
};

const SegmentedTabs: FC<Props> = forwardRef(({
  options,
  onChange,
  value,
  tabBarExtraContent,
  destroyInactiveTabs = false,
  wrapClassName,
  ...resetProps
}, ref:any) => {
  const { themeToken } = useTheme();
  const [tabValue, setTabValue] = useSafeState<string | number>();
  const [renderChildrenMap, setRenderChildrenMap] = useSafeState<Record<string, boolean>>({
    [value as string]: true,
  });


  useEffect(() => {
    if (isEqual(value, tabValue)) return;

    setTabValue(value);

    setRenderChildrenMap({
      ...(!destroyInactiveTabs ? renderChildrenMap : {}),
      [value as string]: true,
    });
  }, [value, tabValue, destroyInactiveTabs, setTabValue, setRenderChildrenMap, renderChildrenMap]);

  const handleTabValueChange: SegmentedProps['onChange'] = (value) => {
    // Trigger external change event
    onChange?.(value);
    setTabValue(value);
    setRenderChildrenMap({
      ...(!destroyInactiveTabs ? renderChildrenMap : {}),
      [value]: true,
    });
  };

  useImperativeHandle(ref,()=>{
    return {
      handleTabValueChange
    }
  })

  const mergeValue = value || tabValue;

  return (
    <SegmentedTabsContainer $token={themeToken} vertical className={wrapClassName}>
      <header className="segmented-tabs-header">
        <Flex>
          <Segmented
            options={options}
            value={mergeValue}
            onChange={handleTabValueChange}
            {...resetProps}
          />
          {tabBarExtraContent && (
            <div className="tab-bar-extra-content-wrap">{tabBarExtraContent}</div>
          )}
        </Flex>
      </header>
      <main className="segmented-tabs-content">
        {map(
          options,
          (item) =>
            renderChildrenMap[item.value] && (
              <div
                hidden={mergeValue !== item.value}
                className="segmented-tabs-content-item"
                key={item.value}
              >
                {typeof item.children === 'function' ? (
                  <item.children
                    key={item.value}
                    segmentedValue={mergeValue}
                    onChange={handleTabValueChange}
                  />
                ) : (
                  item.children
                )}
              </div>
            )
        )}
      </main>
    </SegmentedTabsContainer>
  );
});

export default SegmentedTabs;
