import { useMemo } from 'react';

import { Flex } from 'antd';

import classNames from 'classnames';

import AiDescIcon from '@/assets/icon/aidesc.png';
import { IconFont } from '@/components/ui';
import {
  DESC_OPTIONS_LIST,
  VARIABLE_TABS_VALUE,
  VAR_OPTIONS_KEY,
  VAR_OPTIONS_LIST,
} from '@/constants/variable';

import { ListItemContainer } from '../../style';

interface Props {
  type: VARIABLE_TABS_VALUE;
  onChange: ({ key, step }: { key: VAR_OPTIONS_KEY; step?: number }) => void;
}

const Index = ({ type, onChange }: Props) => {
  const iconRender = (key: VAR_OPTIONS_KEY, icon: string) => {
    if (key === VAR_OPTIONS_KEY.ai_value) {
      return <img width={16} src={AiDescIcon} />;
    }
    return <IconFont type={icon} />;
  };

  const list = useMemo(() => {
    if (type === VARIABLE_TABS_VALUE.desc) {
      return DESC_OPTIONS_LIST;
    }
    return VAR_OPTIONS_LIST;
  }, [type]);

  return (
    <Flex vertical className="options-list">
      {list.map(({ label, desc, key, icon }) => {
        return (
          <ListItemContainer key={key} onClick={() => onChange({ key })}>
            <div className={classNames('icon-content', key)}>{iconRender(key, icon)}</div>
            <Flex flex={1} gap={4} vertical>
              <span className="label">{label}</span>
              <span className="desc">{desc}</span>
            </Flex>
            <IconFont rotate={-90} type="icon-arrow-down" />
          </ListItemContainer>
        );
      })}
    </Flex>
  );
};

export default Index;
