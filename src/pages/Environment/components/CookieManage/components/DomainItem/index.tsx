import { Dispatch, useMemo } from 'react';

import produce from 'immer';
import { cloneDeep, keys } from 'lodash';

import Collapse from '@/components/ui/Collapse';
import Empty from '@/components/ui/Empty';
import IconFont from '@/components/ui/IconFont';
import { DomainInfoProps } from '@/types/project/cookie';

import { ICookie } from '../../types';
import CookieTab from './components/CookieTab';

import { LabelContainer } from './style';

interface Props {
  value: DomainInfoProps;
  onChange: Dispatch<DomainInfoProps>;
  project_id: string | undefined;
}

const Index = (props: Props) => {
  const { value, onChange, project_id } = props;

  const handleChangeValue = (type: string, val: any) => {
    const newVal = produce(value, (draft: any) => {
      draft[type] = val;
    });
    onChange(newVal);
  };

  const removerDomain = (domain: string) => {
    const newCookieObj = cloneDeep(value?.cookieObj);
    const cookie_ids: any = [];
    newCookieObj[domain].forEach((item: ICookie) => {
      cookie_ids.push(item.cookie_id);
    });
    if (cookie_ids.length) {
      delete newCookieObj[domain];
      handleChangeValue('cookieObj', newCookieObj);
    }
  };

  const renderLabel = (key: string) => (
    <LabelContainer>
      <div className="domin">{key}</div>
      <span className="title-cookie">Cookie</span>
      <span className="num">{Object.keys(value?.cookieObj[key]).length}</span>
      <IconFont
        onClick={(e) => {
          e.stopPropagation();
          removerDomain(key);
        }}
        style={{ color: 'var(--icon-color)' }}
        type="icon-delete"
      />
    </LabelContainer>
  );

  const items = useMemo(() => {
    return Object.keys(value?.cookieObj).map((key) => ({
      key,
      label: renderLabel(key),
      children: (
        <CookieTab domain={key} value={value} onChange={onChange} />
      ),
    }));
  }, [value]);

  return (
    <>
      {keys(value?.cookieObj)?.length ? (
        <Collapse defaultActiveKey={Object.keys(value?.cookieObj)[0]} items={items} />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default Index;
