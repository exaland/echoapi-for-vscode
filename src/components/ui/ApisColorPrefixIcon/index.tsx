import { FC } from 'react';

import cn from 'classnames';

import IconFont from '@/components/ui/IconFont';

import { ApisColorPrefixIconContainer } from './style';

const defaultGradientColor = ['#F6504B', '#F98E8B'];

interface Props {
  gradientColor: string[];
  icon: string;
  className?: string;
}

const ApisColorPrefixIcon: FC<Props> = ({ gradientColor, icon, className }) => {
  return (
    <ApisColorPrefixIconContainer
      className={cn(className)}
      style={{
        background: `linear-gradient(${(gradientColor || defaultGradientColor).join(',')})`,
      }}
    >
      <IconFont type={icon} />
    </ApisColorPrefixIconContainer>
  );
};

export default ApisColorPrefixIcon;
