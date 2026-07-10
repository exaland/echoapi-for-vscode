import React, { useCallback } from "react";
import { IconFont } from "@/components/ui";
import { Dropdown, Flex, Input, MenuProps, message, Typography } from "antd";
import { ShareContainer } from "./style";
import { useSafeState } from "ahooks";
import useDocsData from "./hooks/useDocsData";
import useShare from "@/store/useShare";
import { useApis } from "@/store";
import { last } from "lodash";
import { ApiDetailsData } from "@/types/apis/api";
import { useTranslation } from "react-i18next";
import { openUrl } from "@/utils/open";
import { copyApiDocsUrlToClipboard, getApiDocsUrlById } from "@/utils/share";
import SharePanel from "./components/SharePanel";

const SharePage = () => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useSafeState("");

  const shareData = useShare((state) => state.shareData);
  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);
  const { filteredShareList } = useDocsData({
    searchIncludesField: ["name", "url"],
    dataSource: apiOriginDetailsList,
    treeDataFilterParams: {
      value: searchValue,
    },
    shareData,
  });

  const dropdownContextMenu: MenuProps["items"] = [
    {
      label: (
        <Flex gap={8} align="center">
          <IconFont type="icon-copy" />
          {t("docs.document.copy_link")}
        </Flex>
      ),
      key: "copy_link",
    },
    {
      label: (
        <Flex gap={8} align="center">
          <IconFont type="icon-open-new-window" />
          {t("docs.document.open_link")}
        </Flex>
      ),
      key: "open_link",
    },
    {
      label: (
        <Flex gap={8} align="center">
          <IconFont type="icon-delete" />
          Delete
        </Flex>
      ),
      key: "delete",
    },
  ];

  const handleMoreOperateClick = async (
    nodeItem: ApiDetailsData,
    keyPath: string[],
  ) => {
    const actionType = last(keyPath) || "";
    switch (actionType) {
      case "delete":
        window?.vscode.postMessage({
          action: "deleteShare",
          data: { target_id: nodeItem.target_id },
        });
        break;
      case "export":
        window?.vscode.postMessage({
          action: "exportOpenApiById",
          data: { target_id: nodeItem.target_id },
        });
        break;
      case "open_link":
        openUrl(getApiDocsUrlById(nodeItem.target_id));
        break;
      case "copy_link":
        copyApiDocsUrlToClipboard(nodeItem.target_id, () =>
          message.success(t("supplement.clipboard_success")),
        );
        break;
      default:
        break;
    }
  };

  const nodeItemDropdownContextMenu = useCallback(
    (nodeItem: ApiDetailsData): MenuProps => {
      return {
        items: dropdownContextMenu,
        onClick: ({ keyPath }) => handleMoreOperateClick(nodeItem, keyPath),
      };
    },
    [],
  );

  return (
    <ShareContainer>
      <Flex justify="space-between">
        <Typography.Text
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--font-title-color)",
          }}
        >
          Share List
        </Typography.Text>
        <Input
          prefix={<IconFont type="icon-search-line" />}
          placeholder={"Search by keywords"}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          style={{ width: "240px" }}
        />
      </Flex>
      <SharePanel
        searchValue={searchValue}
        shareList={filteredShareList}
        activeTab={""}
        menuType={"share"}
      />
    </ShareContainer>
  );
};

export default SharePage;
