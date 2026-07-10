import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ConfigProvider, Form, Spin, Typography } from "antd";
import type { RcFile } from "antd/es/upload";

import { useSafeState } from "ahooks";
import classnames from "classnames";

import { ImportContent } from "@/components/business";
import { ImportExportWrap } from "./style";
import AlertText from "@/components/ui/AlertText";
import IconFont from "@/components/ui/IconFont";
import Radio from "@/components/ui/Radio";
import Tooltip from "@/components/ui/Tooltip";
import useTheme from "@/hooks/useTheme";

import {
  IMPORT_TYPE_ENUM,
  IMPORT_TYPE_LIST,
  IMPORT_TYPE_MAP,
  ImportLocationEnum,
} from "@/constants/settings";
import { useSystemConfig } from "@/store";
import { isString } from "lodash";

const { Title } = Typography;

const ImportProjectManual = () => {
  const { themeToken } = useTheme();
  const [fileType, setFileType] = useSafeState<IMPORT_TYPE_ENUM>(
    IMPORT_TYPE_ENUM.CURL
  );
  const [uploadFile, setUploadFile] = useSafeState<RcFile | null>(null);
  const [importLocation, setImportLocation] = useSafeState<ImportLocationEnum>(
    ImportLocationEnum.append
  );

  const [importLoading, setImportLoading] = useSafeState<boolean>(false);

  const import_data_init_type = useSystemConfig(
    (i) => i?.systemConfig?.import_data_init_type
  );

  useEffect(() => {
    if (isString(import_data_init_type) && import_data_init_type.length > 0) {
      setFileType(import_data_init_type);
    }
  }, [import_data_init_type]);

  const [swaggerUrl, setSwaggerUrl] = useSafeState<string>("");
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const contentProps = {
    form,
    importLocation,
    setImportLocation,
    uploadFile,
    setUploadFile,
    swaggerUrl,
    setSwaggerUrl,
    fileType,
    setImportLoading
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Upload: {
            colorBorder: themeToken.colorDeepGray,
            colorFillAlter: 'var(--vscode-settings-focusedRowBackground)',
            actionsColor: themeToken.colorError,
            colorTextDescription: themeToken.fontContentColor,
            controlItemBgHover: themeToken.formHoverColor,
          },
        },
      }}
    >
      <Spin spinning={importLoading}>
        <ImportExportWrap $token={themeToken}>
          <Title style={{ fontSize: "16px" }} level={3}>
            {t("settings.import_project.title")}
          </Title>
          <div className="import-project-item">
            <div className="import-project-item-title">
              {t("settings.import_project.source")}
            </div>
            <div className="import-project-item-content">
              <Radio.Group value={fileType}>
                {IMPORT_TYPE_LIST.map((item: any) => (
                  <Tooltip
                    title={item?.disabled ? t("supplement.will_online") : ""}
                  >
                    <div
                      key={item.key}
                      className={classnames({
                        "radio-card": true,
                        active: item.key === fileType,
                      })}
                    >
                      <Radio
                        key={item.key}
                        value={item.key}
                        disabled={item?.disabled}
                        onClick={() => {
                          setUploadFile(null);
                          if (
                            ![
                              IMPORT_TYPE_ENUM.SWAGGER,
                              IMPORT_TYPE_ENUM.SWAGGERURL,
                              IMPORT_TYPE_ENUM.POSTMAN,
                              IMPORT_TYPE_ENUM.INSOMNIA,
                              IMPORT_TYPE_ENUM.THUNDER_CLIENT,
                              IMPORT_TYPE_ENUM.ECHOAPI,
                              IMPORT_TYPE_ENUM.CURL,
                            ].includes(item.key)
                          ) {
                            setImportLocation(ImportLocationEnum.create);
                          }
                          setFileType(item.key);
                          form.resetFields();
                        }}
                      >
                        <span className="radio-card-content">
                          <IconFont type={item.icon} />
                          {item.value}
                        </span>
                      </Radio>
                    </div>
                  </Tooltip>
                ))}
              </Radio.Group>
            </div>
          </div>
          <ImportContent {...contentProps} />
        </ImportExportWrap>
      </Spin>
    </ConfigProvider>
  );
};

export default ImportProjectManual;
