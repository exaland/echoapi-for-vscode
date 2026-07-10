import { size } from 'lodash';

import Empty from '@/components/ui/Empty';

import { AllListWrapper } from './style';
import { EventItem } from '@/types/testing';
import EventItemComponent from './eventItem';

type CommonTestingResultProps = {
  testingResult?: any[]; // Type determined at runtime
  isResult?: boolean;
  value: Array<EventItem>;
  onChange:(index:number,obj:any)=>void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const All = ({ value, onChange }: CommonTestingResultProps) => {

  return size(value) > 0 ? (
    <AllListWrapper>
      {value.map((item:EventItem,index: number) => {
        return <EventItemComponent value={{...item.data, enabled:item.enabled}} onChange={(val)=>{
          onChange(index,val);
        }}/>;
      })}
    </AllListWrapper>
  ) : (
    <Empty />
  );
};

export default All;
