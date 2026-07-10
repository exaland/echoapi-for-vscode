import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useSafeState } from 'ahooks';
import dayjs from 'dayjs';
import { isObject } from 'lodash';

import ApisDiffJsonContent from '@/components/business/ApisDiffJsonContent';
import { Modal } from '@/components/ui/Modal';

import { VersionModalWrap } from './style';
import { EnvListItem } from '@/types/envManage';

interface Props {
  curItem: {
    localEnv:EnvListItem,
    cloudEnv:EnvListItem,
  };
  open: boolean;
  onCancel: () => void;
}

const VersionComparison = (props: Props) => {
  const { t } = useTranslation();
  const { curItem, open,  onCancel } = props || {};

  const [modal, contextHolder] = Modal.useModal();

  const [prevDetails, setPrevDetails] = useSafeState<any>();
  const [nextDetails, setNextDetails] = useSafeState<any>();
  useEffect(() => {
    if (isObject(curItem?.localEnv) && isObject(curItem?.cloudEnv)) {
      setPrevDetails(curItem?.localEnv);
      setNextDetails(curItem?.cloudEnv);
    }
  }, [curItem]);
  return (
    <Modal
      title={'Push Environment Conflict Comparison'}
      onCancel={onCancel}
      footer={null}
      open={open}
      width={880}
    >
      {contextHolder}
      <VersionModalWrap>
        <Flex vertical gap={16}>
          <Flex align="center" gap={16} justify="space-between">
            <span className="version-tip">
              {'Local Data'}
            </span>
            <span className="version-tip">
              {'Cloud Data'}
            </span>
          </Flex>
          <ApisDiffJsonContent prevDetails={prevDetails} nextDetails={nextDetails} />
        </Flex>
      </VersionModalWrap>
    </Modal>
  );
};

export default VersionComparison;
