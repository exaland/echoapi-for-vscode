import classNames from 'classnames';
import { ValueOf } from 'type-fest';

import useTheme from '@/hooks/useTheme';

import { DotWrapper } from './style';

const TYPE_MAP = {
  success: 'success',
  error: 'error',
} as const;

export type DotProps = {
  /**type */
  type?: ValueOf<typeof TYPE_MAP>;
  /**size */
  size?: number;
  /**class name */
  className?: string;
  /**custom color */
  color?: string;
};

const Dot = ({ size = 8, type = TYPE_MAP.success, className = '', color = '' }: DotProps) => {
  const { themeToken } = useTheme();
  return (
    <DotWrapper $token={themeToken} className={className}>
      <div
        className={classNames('dot', [{ [TYPE_MAP[type]]: true }])}
        style={{ width: size, height: size, backgroundColor: color }}
      ></div>
    </DotWrapper>
  );
};

export default Dot;
