import { FC, memo, useMemo } from 'react';

import cn from 'classnames';

import IconFont from '@/components/ui/IconFont';
import { REQUEST_METHOD_MAP } from '@/constants/apis';

import { PrefixIconContainer } from './style';
import { isString } from 'lodash';

interface Props {
  type: string;
  method?: string;
  wrapClassName?: string;
  style?: React.CSSProperties;
}

const PrefixIcon: FC<Props> = memo(({ type, method, wrapClassName = '', style = {} }) => {
  const computed = useMemo(() => {
    const typeMap: { [key: string]: { icon: string | React.ReactNode; className: string } } = {
      sse: { icon: 'SSE', className: 'sse' },
      doc: { icon: 'MD', className: 'doc' },
      folder: { icon: '', className: 'icon-home' },
      websocket: { icon: 'WS', className: 'ws' },
      websocket2: { icon: 'WS', className: 'ws' },
      socketio: { icon: 'IO', className: 'io' },
      grpc: { icon: 'GRPC', className: 'grpc' },
      graphql: { icon: 'GQL', className: 'gql' },
      socket_method: { icon: 'TCP', className: 'socket-service' },
      socket: { icon: <IconFont type="icon-tcp" />, className: 'socket' },
      note: { icon: <IconFont type="icon-note" />, className: 'notes' },
      testing: { icon: <IconFont type="icon-testing-case" />, className: 'testing' },
      kit: { icon: <IconFont type="icon-testing-suite" />, className: 'kit' },
      model: { icon: <IconFont type="icon-data-model" />, className: 'data-model' },
      sample: { icon: <IconFont type="icon-api-sample" />, className: 'api-sample' },
    };

    if (method) {
      typeMap.api = {
        icon: REQUEST_METHOD_MAP?.[method] || method,
        className: REQUEST_METHOD_MAP?.[method] ? method?.toLowerCase() : 'DEFAULT',
      };
    }

    return typeMap[type];
  }, [type, method]);

  const renderIcon = (icon:any)=>{
    if (isString(icon) && icon.length > 4) {
      return icon.substring(0, 4);
    }
    return icon;
  }

  return (
    <>
      {(computed?.icon && (
        <PrefixIconContainer className={cn(computed?.className, wrapClassName)} style={style}>
          {renderIcon(computed?.icon)}
        </PrefixIconContainer>
      )) ||
        null}
    </>
  );
});

export default PrefixIcon;
