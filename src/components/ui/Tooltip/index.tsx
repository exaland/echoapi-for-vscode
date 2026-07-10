import { FC } from 'react';

import { Tooltip as AntdTooltip, TooltipProps } from 'antd';

type Props = TooltipProps;

const Tooltip: FC<Props> = (props) => {
  return <AntdTooltip {...props} />;
};

Tooltip.defaultProps = {
  mouseEnterDelay: 0.5,
};

export default Tooltip;
