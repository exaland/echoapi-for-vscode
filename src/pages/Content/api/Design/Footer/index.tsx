import React from 'react'
import { DesignFooterWrap } from './style';
import { Flex, Segmented, Typography } from 'antd';
import SvgDesginError from '@/assets/icon/desgin_error.svg?react';
import { useTranslation } from 'react-i18next';


export default function index(props: { footerType: string; setFooterType: (type:'Form' | 'Code')=>void; }) {
  const {footerType ,setFooterType} = props;
  const { t } = useTranslation();

  return (
    <DesignFooterWrap>
      <Segmented<string>
        value={footerType}
        options={[{value:'Form',label:t('common.form')}, {value:'Code',label:t('common.code_option')}]}
        onChange={(val) => {
          setFooterType(val as 'Form' | 'Code');
        }}
      />
      <Flex justify='center' gap={4} align='center'>
        {t('common.test_component.verification')}  
        <Typography.Text style={{ padding: '0 2px', background: 'var(--color-primary-opacity)', color: 'var(--color-primary)', borderRadius: '2px', fontSize: '10px' }}>
         {t('supplement.will_online')}
        </Typography.Text>
      </Flex>
    </DesignFooterWrap>
  )
}
