import { FC, useEffect } from 'react';

import { Flex, Input, Tooltip } from 'antd';

import { useDebounce, useSafeState } from 'ahooks';
import i18next from 'i18next';

import { TreeDataFilterParams } from '@/types/tree';
import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';

import { SearchContainer } from './style';
import { useTranslation } from 'react-i18next';


interface Props {
  treeDataFilterParams: TreeDataFilterParams;
  setTreeDataFilterParams: (params: TreeDataFilterParams) => void;
  searchInputPlaceholder?: string;
  onPosition:(key:string)=>void;
  onExpandAll:(isExpanded:boolean)=>void;
  apisActiveKey:string;
  showActions?:boolean;
  type?:string;
  onHistoryClick?:()=>void;
}

const Search: FC<Props> = ({
  treeDataFilterParams,
  setTreeDataFilterParams,
  searchInputPlaceholder = i18next.t('search_tree.api_search_tip'),
  onPosition,
  onExpandAll,
  onHistoryClick,
  apisActiveKey,
  showActions,
  type
}) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useSafeState(treeDataFilterParams.value);
  const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });

  const [isExpanded, setIsExpanded] = useSafeState(false);

  useEffect(() => {
    handleChange('value', debouncedSearchValue);
  }, [debouncedSearchValue]);

  const handleChange = (field: string, value: string) => {
    setTreeDataFilterParams({
      ...treeDataFilterParams,
      [field]: value,
    });
  };
  
  const handleHistory = ()=>{
    onHistoryClick?.();
  };

  return (
    <SearchContainer>
      <div className="search-wrap">
          <Input
            prefix={<IconFont style={{color:"var(--vscode-input-placeholderForeground)"}} type="icon-search-line" />}
            placeholder={searchInputPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          {showActions &&  <Flex className="actions-wrap" align="center">
              {type == 'design' &&  <Tooltip title={'History'}>
                <IconFont type="icon-history" style={{ fontSize: 12 }} onClick={handleHistory} />
              </Tooltip>}

              <Tooltip placement="topRight" title={t('common.folder_operate.locate')}>
                <IconFont type="icon-positioning" onClick={()=>onPosition(apisActiveKey)} />
              </Tooltip>
              <Tooltip
                placement="topRight"
                title={
                  isExpanded
                    ? t('common.folder_operate.collapse')
                    : t('common.folder_operate.expand')
                }
              >
                <IconFont
                  type={isExpanded ? 'icon-folding' : 'icon-drill-down'}
                  onClick={()=>{
                    setIsExpanded(!isExpanded);
                    onExpandAll(isExpanded);
                  }}
                />
              </Tooltip>
            </Flex>}
        </div>
    </SearchContainer>
  );
};

export default Search;
