import React from 'react';

import IconFont from '@/components/ui/IconFont';

interface Props {
  action: string;
}
const IconMap: { [k: string]: React.ReactNode } = {
  connect: <IconFont className="icon" type="icon-ok" style={{ color: 'var(--color-success)' }} />,
  disconnect: (
    <IconFont className="icon" type="icon-ok" style={{ color: 'var(--color-success)' }} />
  ),
  message: (
    <IconFont className="icon" type="icon-download" style={{ color: 'var(--color-info)' }} />
  ),
  send: (
    <IconFont
      className="icon"
      type="icon-download"
      style={{ transform: 'rotate(180deg)', color: 'var(--color-warning)' }}
    />
  ),
  error: (
    <IconFont className="icon" type="icon-small-close" style={{ color: 'var(--color-error)' }} />
  ),
  complete: (
    <IconFont className="icon" type="icon-disconnected" style={{ color: 'var(--color-warning)' }} />
  ),
};
const WsIcon = (props: Props) => {
  const { action } = props || {};
  return <>{IconMap[action] || null}</>;
};

export default WsIcon;
