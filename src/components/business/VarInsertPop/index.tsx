import { useEffect, useMemo, useRef, useState } from 'react';

import { PopoverProps } from 'antd';

import { mockExp } from 'exp-mock';

import { Popover } from '@/components/ui';
import { VARIABLE_LIST_CONTENT_KEY } from '@/constants/common';
import { MOCK_TABS_KEY, VARIABLE_TABS_VALUE, VAR_OPTIONS_KEY } from '@/constants/variable';
import { VariableInsertContext } from '@/contexts';
import { useSystemConfig } from '@/store';
import { FuncListRenderItem, InsertAction } from '@/types/apis/variable';

import { VarContent, VarList } from './components';

import { ContentContainer } from './style';

interface Props extends PopoverProps {
  children: React.ReactNode;
  open: boolean;
  tabValue?: VARIABLE_TABS_VALUE;
  optionKey?: VAR_OPTIONS_KEY;
  value?: string;
  setOpen: React.Dispatch<boolean>;
  fnList?: FuncListRenderItem[];
  mockTabsKey?: MOCK_TABS_KEY;
  fakerJsParamList?: { key: string; value: any }[];
  onChange: (str: string, operation: VAR_OPTIONS_KEY, action: InsertAction) => void;
  // whether it is dynamic value insertion (no description)
  isInsertDynamic?: boolean;
  formatInfo?: any;
}

const Index = ({
  children,
  tabValue,
  open,
  setOpen,
  optionKey: originOptionKey,
  value: originValue,
  onChange,
  fnList: originFnList,
  fakerJsParamList: originFakerJsParamList,
  mockTabsKey: originMockTabsKey = MOCK_TABS_KEY.faker,
  isInsertDynamic = false,
  formatInfo: originFormatInfo = {},
  ...restProps
}: Props) => {
  const [tabsValue, setTabsValue] = useState<VARIABLE_TABS_VALUE>(VARIABLE_TABS_VALUE.value);
  const [step, setStep] = useState<number>(1);
  const [optionKey, setOptionKey] = useState<VAR_OPTIONS_KEY>(VAR_OPTIONS_KEY.var);
  const [value, setValue] = useState<string>('');
  const contentRef = useRef<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [height, setHeight] = useState(200);
  const language = useSystemConfig((state) => state.systemConfig.language);

  useEffect(() => {
    if (open) {
      // All origin values can be calculated here via value, or in the parent component
      const el = document.querySelector(`#${VARIABLE_LIST_CONTENT_KEY}`);
      if (el) {
        setHeight(el?.getBoundingClientRect()?.height);
      }
      setValue(originValue || '');
      if (originValue) {
        setIsEdit(true);
      }
      setTabsValue(tabValue || VARIABLE_TABS_VALUE.value);
      if (originOptionKey) {
        if ([VAR_OPTIONS_KEY.desc, VAR_OPTIONS_KEY.ai_desc].includes(originOptionKey)) {
          setTabsValue(VARIABLE_TABS_VALUE.desc);
        }
        setOptionKey(originOptionKey);
        setStep(2);
      }
    } else {
      reset();
    }
  }, [open]);

  const reset = () => {
    setTabsValue(VARIABLE_TABS_VALUE.value);
    setStep(1);
    setIsEdit(false);
    setOptionKey(VAR_OPTIONS_KEY.var);
  };

  const stepChange = ({
    key = VAR_OPTIONS_KEY.var,
    step = 2,
  }: {
    key?: VAR_OPTIONS_KEY;
    step?: number | undefined;
  }) => {
    setStep(step);
    setOptionKey(key);
    if (step === 1) {
      setValue('');
    } else {
      if (originOptionKey === key) {
        setValue(originValue || '');
      }
      if (key === VAR_OPTIONS_KEY.ai_value) {
        fixedRefresh();
      }
    }
  };

  const fixedRefresh = async () => {
    try {
      const data = await mockExp('{{@ai()}}', {}, language);
      if (data) {
        setValue(data);
      }
    } catch (err) {}
  };

  const content = useMemo(() => {
    const width = step === 1 ? 320 : 320;
    const h = step === 1 ? height : 448;
    return (
      <div
        style={{
          width,
          height: h,
          transition: 'width .2s,height .2s',
        }}
      >
        <ContentContainer id={VARIABLE_LIST_CONTENT_KEY} className={`${step === 1 && 'active'}`}>
          <VarList onChange={stepChange} type={tabsValue} />
        </ContentContainer>
        <VarContent className={`${step === 2 && 'active'}`} ref={contentRef} />
      </div>
    );
  }, [step, tabsValue, language, height]);
  
  return (
    <VariableInsertContext.Provider
      value={{
        optionKey,
        stepChange,
        onChange: (str, action) => onChange(str, optionKey, action),
        value,
        isEdit,
        valueChange: setValue,
        setOpen,
        originFnList,
        fixedRefresh,
        originMockTabsKey,
        originFakerJsParamList,
        isInsertDynamic,
        originFormatInfo,
        step,
      }}
    >
      <Popover
        onOpenChange={(open) => {
          if (!open && contentRef?.current?.funcOpen) return;
          setOpen(open);
        }}
        open={open}
        trigger={['click']}
        content={content}
        {...restProps}
      >
        {children}
      </Popover>
    </VariableInsertContext.Provider>
  );
};

export default Index;
