import { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelGroupProps,
  PanelProps,
  PanelResizeHandle,
  PanelResizeHandleProps,
} from 'react-resizable-panels';

import { Flex, Space } from 'antd';

import { useDebounceFn, useSafeState } from 'ahooks';
import cn from 'classnames';
import { t } from 'i18next';
import produce from 'immer';
import { isEqual, omit } from 'lodash';

import Popover from '@/components/ui/Popover';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';
import { STATUS_CODE } from '@/constants/common';
import useTheme from '@/hooks/useTheme';
import { useSystemConfig } from '@/store';
import { DirectionType } from '@/types/common';

import { ResizablePanelsContainer } from './style';

const defaultPanelProps = { defaultSize: 50, minSize: 5 };

type FinalPanelProps = PanelProps & {
  collapseTitle?: string;
};

type Props = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftPanelProps?: FinalPanelProps;
  rightPanelProps?: FinalPanelProps;
  panelGroupProps?: PanelGroupProps;
  panelResizeHandleProps?: PanelResizeHandleProps;
  showDirectionBtn?: boolean;
  showRightCollapseBtn?: boolean;
  showStaticHandleBorder?: boolean;
  onDirectionChange?: (direction: DirectionType) => void;
};

const ResizablePanels = forwardRef((props: Props, ref) => {
  const {
    leftPanel,
    rightPanel,
    panelGroupProps = { direction: 'horizontal' },
    leftPanelProps = { ...defaultPanelProps },
    rightPanelProps = { ...defaultPanelProps },
    panelResizeHandleProps,
    showDirectionBtn = false,
    showRightCollapseBtn = false,
    showStaticHandleBorder = true,
    onDirectionChange,
  } = props;

  const { themeToken } = useTheme();

  const systemConfigTabDirection = useSystemConfig((state) => state.systemConfig?.tab_direction);
  const language = useSystemConfig((state) => state.systemConfig?.language);

  const [direction, setDirection] = useSafeState<DirectionType>(panelGroupProps.direction);
  const [collapse, setCollapse] = useSafeState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const isHorizontal = isEqual(direction, 'horizontal');
  const isVertical = isEqual(direction, 'vertical');

  useEffect(() => {
    panelGroupProps.direction && setDirection(panelGroupProps.direction);
  }, [panelGroupProps.direction]);

  // Watch system config for split-screen direction changes
  useEffect(() => {
    if (!showDirectionBtn || !systemConfigTabDirection) return;

    const _direction = isEqual(systemConfigTabDirection, STATUS_CODE.ENABLE)
      ? 'vertical'
      : 'horizontal';

    setDirection(_direction);
    onDirectionChange?.(_direction);
  }, [systemConfigTabDirection, showDirectionBtn]);

  useImperativeHandle(ref, () => ({
    setPanelGroupLayout,
    resetLayout,
  }));

  // Update system config for split-screen direction
  const { run: saveSystemSetting } = useDebounceFn(
    async (_direction) => {
      if (!showDirectionBtn) return;

      const { systemConfig, updateSystemConfig } = useSystemConfig.getState();
      const systemValue = _direction === 'vertical' ? STATUS_CODE.ENABLE : STATUS_CODE.DISABLE;

      const newSystemConfig = produce(systemConfig, (draft) => {
        draft['tab_direction'] = systemValue;
      });

      updateSystemConfig(newSystemConfig);

      window?.vscode.postMessage({
        action: 'setSystemConfig',
        data:{ tab_direction: systemValue}
      });

      // await saveSystemSettingRequest({ configure: { tab_direction: systemValue } });
    },
    {
      wait: 1000,
    }
  );

  const handleChangeDirection = (direction: DirectionType) => {
    setDirection(direction);
    onDirectionChange?.(direction);
    showDirectionBtn && saveSystemSetting(direction);
  };

  const setPanelGroupLayout = (layout: number[]) => {
    panelGroupRef.current?.setLayout(layout);
  };

  const resetLayout = () => {
    setPanelGroupLayout([50, 50]);
  };

  const handleCollapse = (position: 'left' | 'right', value: boolean) => {
    setCollapse((prev) => ({ ...prev, [position]: value }));
  };

  const handleRightCollapseWithOne = () => {
    const size = rightPanelProps.collapsedSize || defaultPanelProps.minSize;
    setPanelGroupLayout([100 - size, size]);
  };

  const popoverContent = (
    <Space className="direction-popover-content" direction="vertical">
      <Flex
        className={cn('direction-item-btn', isVertical && 'active')}
        align="center"
        justify="left"
        onClick={() => handleChangeDirection('vertical')}
      >
        <IconFont type="icon-up-down" />
        <span className="title">{t('common.response_component.single_pane')}</span>
      </Flex>
      <Flex
        className={cn('direction-item-btn', isHorizontal && 'active')}
        align="center"
        justify="left"
        onClick={() => handleChangeDirection('horizontal')}
      >
        <IconFont type="icon-left-right" />
        <span className="title">{t('common.response_component.two_pane')}</span>
      </Flex>
    </Space>
  );

  const leftCollapse = (
    <div className="left-collapse-wrap" onClick={resetLayout}>
      <Flex vertical={isHorizontal} justify="center" align="center">
        <IconFont type="icon-left-folding" rotate={isVertical ? 270 : 180} />
        <span className={cn('collapse-title', direction, language === 'en' && 'noSpacing')}>
          {leftPanelProps?.collapseTitle || ''}
        </span>
      </Flex>
    </div>
  );

  const rightCollapse = (
    <div className="right-collapse-wrap" onClick={resetLayout}>
      <Flex vertical={isHorizontal} justify="center" align="center">
        <IconFont type="icon-left-folding" rotate={isVertical ? 90 : 0} />
        <span className={cn('collapse-title', direction, language === 'en' && 'noSpacing')}>
          {rightPanelProps?.collapseTitle || ''}
        </span>
      </Flex>
    </div>
  );

  return (
    <ResizablePanelsContainer $token={themeToken}>
      <PanelGroup {...panelGroupProps} direction={direction} ref={panelGroupRef}>
        {/* left and top panel */}
        <Panel
          onCollapse={() => handleCollapse('left', true)}
          onExpand={() => handleCollapse('left', false)}
          {...omit(leftPanelProps, ['collapseTitle'])}
          className={cn('resizable-panel-left-wrap', leftPanelProps?.className)}
        >
          {!collapse.left ? leftPanel : leftCollapse}
        </Panel>
        {/* bar */}
        <div
          className={cn('resizable-panel-handle', direction, panelResizeHandleProps?.className, {
            'static-handle-border': showStaticHandleBorder,
          })}
        >
          <PanelResizeHandle {...panelResizeHandleProps} className="resizable-bar" />
           {/* Collapse to one side */}
          {showRightCollapseBtn && !collapse.right && (
            <div className="right-collapse-btn" onClick={handleRightCollapseWithOne}>
              <IconFont type="icon-drop-down" rotate={isHorizontal ? -90 : 0} />
            </div>
          )}
        </div>
        {/* right and bottom panel */}
        <Panel
          onCollapse={() => handleCollapse('right', true)}
          onExpand={() => handleCollapse('right', false)}
          {...omit(rightPanelProps, ['collapseTitle'])}
          // NOTE: The width property here is only to fix a flex layout bug
          style={isHorizontal ? { ...rightPanelProps.style, width: 0 } : {}}
          className={cn('resizable-panel-right-wrap', rightPanelProps?.className)}
        >
          {!collapse.right ? rightPanel : rightCollapse}
          {/* Split screen toggle */}
          {showDirectionBtn && !collapse.right && (
            <div className="direction-wrap">
              <Popover
                content={popoverContent}
                overlayInnerStyle={{ padding: 8 }}
                placement="left"
                getPopupContainer={(triggerNode: HTMLElement) =>
                  triggerNode.parentNode as HTMLElement
                }
              >
                <Button>
                  <IconFont style={{color:'var(--icon-color)'}} type="icon-direction" />
                </Button>
              </Popover>
            </div>
          )}
        </Panel>
      </PanelGroup>
    </ResizablePanelsContainer>
  );
});

export default ResizablePanels;
