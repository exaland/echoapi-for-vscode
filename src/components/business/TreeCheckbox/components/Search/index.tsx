import { FC, useEffect } from 'react';

import { Flex, Input } from 'antd';

import { useDebounce, useSafeState } from 'ahooks';
import i18next from 'i18next';
import { concat } from 'lodash';

import { TreeDataFilterParams } from '@/components/business/Tree/types';
import IconFont from '@/components/ui/IconFont';
import {
  DEFAULT_API_MARK_ENUM,
  DEFAULT_API_MARK_ENUM_ALL_OPTION,
  DEFAULT_API_MARK_ENUM_LIST,
} from '@/constants/apis';

import { SearchContainer } from './style';

const DEFAULT_API_MARK_LIST = concat(
  [DEFAULT_API_MARK_ENUM_ALL_OPTION],
  DEFAULT_API_MARK_ENUM_LIST
);

interface Props {
  hasMarkFilter?: boolean;
  searchInputPlaceholder?: string;
  treeDataFilterParams: TreeDataFilterParams;
  setTreeDataFilterParams: (params: TreeDataFilterParams) => void;
}

const Search: FC<Props> = ({
  treeDataFilterParams,
  hasMarkFilter = true,
  searchInputPlaceholder = i18next.t('supplement.folder_api'),
  setTreeDataFilterParams,
}) => {
  const [searchValue, setSearchValue] = useSafeState(treeDataFilterParams.value);
  const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });

  useEffect(() => {
    handleChange('value', debouncedSearchValue);
  }, [debouncedSearchValue]);

  const handleChange = (field: string, value: string | DEFAULT_API_MARK_ENUM) => {
    setTreeDataFilterParams({
      ...treeDataFilterParams,
      [field]: value,
    });
  };

  return (
    <SearchContainer>
      <Flex>
        <div className="search-wrap">
          <Input
            prefix={<IconFont type="icon-search-line" />}
            placeholder={searchInputPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            suffix={
               null
            }
          />
        </div>
      </Flex>
    </SearchContainer>
  );
};

export default Search;
