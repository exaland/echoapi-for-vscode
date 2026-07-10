import useTheme from '@/hooks/useTheme';

import { OrderNumberWrapper } from './style';

const OrderNumber = ({ orderNumber }: { orderNumber: number }) => {
  const { themeToken } = useTheme();
  return <OrderNumberWrapper $token={themeToken}>{orderNumber}</OrderNumberWrapper>;
};

export default OrderNumber;
