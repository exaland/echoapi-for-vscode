import { useEffect, useState } from 'react';

import { isArray, isString, trim } from 'lodash';

import Tooltip from '@/components/ui/Tooltip';
import useProjectSetting from '@/store/useProjectSetting';
import useUserConfig from '@/store/useUserConfig';

import { AiDescriptionWrap } from './style';

const DropContent = (props: any) => {
  const { onChange, filterKey, handleSelect } = props;
  const [paramList, setParamList] = useState([]);
  const { descriptionList, innerDescriptionList } = useProjectSetting();
  const currentProject = useUserConfig((state) => state.currentProject);

  const init = async () => {
    let descList: any = [];

    // Get current project parameter descriptions
    if (isArray(descriptionList)) {
      descList = descList.concat(descriptionList);
    }

    if (currentProject?.is_describe_library === 1) {
      if (isArray(innerDescriptionList)) descList = descList.concat(innerDescriptionList);
    }

    setParamList(descList);
  };

  useEffect(() => {
    init();
  }, [descriptionList, innerDescriptionList]);

  return (
    <AiDescriptionWrap>
      {isArray(paramList) &&
        paramList.length > 0 &&
        paramList.map((item: any) => {
          if (
            isString(item?.key) &&
            item.key.length > 0 &&
            isString(item?.description) &&
            item.description.length > 0
          ) {
            if (isString(filterKey) && trim(filterKey).length > 0) {
              if (trim(filterKey) === trim(item.key)) {
                return (
                  <div
                    key={item?.id || item?.key}
                    onClick={() => {
                      handleSelect();
                      onChange(item?.description || '');
                    }}
                    className="params-desc-item"
                  >
                    <Tooltip placement="topLeft" title={item?.description || ''}>
                      {item?.description || ''}
                    </Tooltip>
                  </div>
                );
              }
            } else {
              return (
                <div
                  key={item?.id || item?.key}
                  onClick={() => {
                    handleSelect();
                    onChange(item?.description || '');
                  }}
                  className="params-desc-item"
                >
                  <Tooltip placement="topLeft" title={item?.description || ''}>
                    {item?.description || ''}
                  </Tooltip>
                </div>
              );
            }
          }
          return null;
        })}
    </AiDescriptionWrap>
  );
};

export default DropContent;
