import { FC, Key, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, CheckboxProps } from 'antd';

import { useSafeState } from 'ahooks';
import { includes, reduce, size } from 'lodash';

import { TreeDataItem } from '@/types/apis/api';

import { AllCheckContainer } from './style';
import i18next from 'i18next';

interface Props {
  dataSource: {
    [key: string]: TreeDataItem;
  };
  treeData: any[];
  filteredTreeList: TreeDataItem[];
  checkedKeys: Key[];
  checkKey?: string;
  setCheckedKeys: (args: Key[]) => void;
  notCalcCheckedTypes: string[];
  allCheckDesc?:string
}

const AllCheck: FC<Props> = ({
  dataSource,
  filteredTreeList,
  checkKey,
  checkedKeys,
  setCheckedKeys,
  notCalcCheckedTypes,
  allCheckDesc = i18next.t('common.push_tip')
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useSafeState(false);
  
  useEffect(() => {
    setChecked(size(checkedKeys) === size(filteredTreeList));
  }, [checkedKeys, filteredTreeList]);

  const calcCheckTotal = useMemo(() => {
    if (!dataSource) return 0;

    return reduce(
      checkedKeys,
      (pre, cur) => {
        if (!includes(notCalcCheckedTypes, dataSource[cur as string]?.target_type)) {
          return pre + 1;
        }
        return pre;
      },
      0
    );
  }, [checkedKeys, dataSource]);

  const handleChange: CheckboxProps['onChange'] = (event) => {
    const value = event.target.checked;

    if (value) {
      setCheckedKeys(filteredTreeList.map((item) => item[checkKey || 'target_id']));
    } else {
      setCheckedKeys([]);
    }

    setChecked(value);
  };

  return (
    <AllCheckContainer>
      <Checkbox checked={checked} onChange={handleChange}>
        <span className="all-check-text">
          {t("common.select_all")}
        </span>
        {allCheckDesc && <span className='all-check-desc'>{allCheckDesc}</span>}
      </Checkbox>
    </AllCheckContainer>
  );
};

export default AllCheck;
