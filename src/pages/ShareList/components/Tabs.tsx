import { Checkbox, Flex, Tabs, theme, Tooltip, Typography } from "antd";

import { SHARE_TAB_LIST } from "../constants";
import { TabsProps } from "../types";

import cn from "classnames";

import { TabsWrap, ShareListWrap, ItemTitleContainer } from "../style";
import { isArray } from "lodash";
import { Empty } from "@/components/ui";
import { ApiDetailsData } from "@/types/apis/api";
import ApisColorPrefixIcon from "@/components/ui/ApisColorPrefixIcon";
import { getBaseIconOfTargetType } from "@/utils/common";
import { formatTimeToDateTimeLong } from "@/utils/time";
import { useMemo } from "react";

const { useToken } = theme;

const TabsPanel = (props: TabsProps) => {
  const {
    tabExtraContent,
    checkedList,
    lists,
    listExtraContent,
    setCheckedList,
  } = props || {};
  const { token } = useToken();

  const renderContent = (item: ApiDetailsData & { share_time: number }) => {
    return (
      <ItemTitleContainer
        key={item.target_id}
        onClick={() => {}}
        className={cn({
          "select-item": false,
        })}
      >
        <div className="name">
          <Checkbox
            onClick={(e) => e?.stopPropagation()}
            value={item.target_id}
          ></Checkbox>
          <ApisColorPrefixIcon
            className="panel-icon"
            icon={getBaseIconOfTargetType(item.target_type).icon}
            gradientColor={
              getBaseIconOfTargetType(item.target_type).gradientColor
            }
          />
          <Tooltip
            title={
              <Flex gap={4} vertical>
                <Typography.Text>{item?.name}</Typography.Text>
                <Typography.Text>{item?.url}</Typography.Text>
              </Flex>
            }
          >
            <Typography.Text ellipsis style={{ flex: 1 }}>
              {item.name}
            </Typography.Text>
          </Tooltip>
        </div>
        <div className="time">{formatTimeToDateTimeLong(item.share_time)}</div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="more-operate-wrap"
        >
          {listExtraContent(item.target_id, item)}
        </div>
      </ItemTitleContainer>
    );
  };
  const tabsItems = useMemo(() => {
    return SHARE_TAB_LIST.map((item) => ({
      label: item.label,
      key: item.key,
      children: (
        <Checkbox.Group
          value={checkedList}
          onChange={(list) => {
            setCheckedList(list);
          }}
        >
          {isArray(lists) && lists.length > 0 ? (
            <ShareListWrap>
              {lists.map((item) => renderContent(item))}
            </ShareListWrap>
          ) : (
            <Empty />
          )}
        </Checkbox.Group>
      ),
    })) as any;
  }, [checkedList, lists]);
  return (
    <TabsWrap $token={token}>
      <Tabs
        tabBarGutter={6}
        destroyInactiveTabPane
        tabBarExtraContent={tabExtraContent}
        items={tabsItems}
      />
    </TabsWrap>
  );
};

export default TabsPanel;
