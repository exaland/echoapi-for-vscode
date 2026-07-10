import { IconFont } from '@/components/ui'
import { Flex } from 'antd'
import { useTranslation } from 'react-i18next';
import DetailDes from './DetailDes';
import { OpenApiMainObj } from '@/types/apis/api';
import { ChangeFuncType } from '@/types/common';

type Props = {
  value: string;
  onChange: ChangeFuncType<OpenApiMainObj>;
}

export default function index(props:Props) {
  const { t } = useTranslation();

  const {value, onChange } = props;

  return (
    <div style={{display: "flex",flexDirection: "column", height: "100%",gap:'12px'}}>
      <Flex gap={8} className="design-title">
        <IconFont type="icon-design-description" />
        {t('api.design.description')}
      </Flex>
      <DetailDes value={value} onChange={onChange} />
    </div>
  )
}
