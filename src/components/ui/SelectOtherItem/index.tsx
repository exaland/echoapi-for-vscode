import useTheme from '@/hooks/useTheme';

import IconFont from '../IconFont';

import { SelectOtherItemWrapper } from './style';

type SelectOtherItemProps = {
  styles?: React.CSSProperties;
  fontSize?: number;
  children?: React.ReactNode;
  onClick?: () => void;
};

const SelectOtherItem = ({ styles, fontSize, children, onClick }: SelectOtherItemProps) => {
  const { themeToken } = useTheme();

  return (
    <SelectOtherItemWrapper align="center" onClick={onClick} style={styles}>
      <IconFont
        style={{ fontSize: fontSize || themeToken.fontSize14 }}
        type="icon-environment-control"
      />
      <div className="text" style={{ fontSize: fontSize || themeToken.fontSize14 }}>
        {children}
      </div>
    </SelectOtherItemWrapper>
  );
};

export default SelectOtherItem;
