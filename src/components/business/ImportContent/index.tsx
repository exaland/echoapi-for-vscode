import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MonacoEditor from "@/components/business/MonacoEditor";


import {
  Flex,
  Form,
  FormInstance,
  Input,
  Switch,
  Upload,
  message,
} from "antd";
import type { RcFile, UploadChangeParam } from "antd/es/upload";

import { isJson5 } from "apipost-tools";
import JSON5 from "json5";
import {
  cloneDeep,
  includes,
  isArray,
  isEqual,
} from "lodash";

import { Button, IconFont, Tooltip } from "@/components/ui";
import {
  APIPOST_FULL_ENV_OPTIONS,
  IMPORT_TIP_MAP,
  IMPORT_TYPE_ENUM,
  IMPORT_TYPE_MAP,
  ImportLocationEnum,
  SWAGGER_FULL_ENV_OPTIONS,
} from "@/constants/settings";
import { useSafeState } from "ahooks";
import { parseSafeBash } from "@/utils/curl";
import ImportApiPreview from "../ImportApiPreview";
import useImportData from "@/store/useImportData";
import axios from "axios";

const { Dragger } = Upload;

interface Props {
  form: FormInstance;
  importLocation: ImportLocationEnum;
  setImportLocation: React.Dispatch<ImportLocationEnum>;
  fileType: IMPORT_TYPE_ENUM;
  uploadFile: RcFile | null;
  setUploadFile: React.Dispatch<RcFile | null>;
  swaggerUrl?: string;
  setSwaggerUrl?: React.Dispatch<string>;
  onCancel?: () => void;
  setImportLoading?: React.Dispatch<boolean>;
}

const Index = ({
  form,
  importLocation,
  uploadFile,
  swaggerUrl,
  setSwaggerUrl,
  fileType,
  onCancel,
  setImportLoading,
}: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useSafeState<string>("");
  const {
    preview,
    updatePreview: setPreview,
    previewLoading,
    updatePreviewLoading: setPreviewLoading,
    previewData,
    updatePreviewData: setPreviewData,
    previewSelectData,
    updatePreviewSelectData: setPreviewSelectData,
  } = useImportData((store) => store);
  const [uploadKey, setUploadKey] = useState(Date.now());

  const accept = useMemo(() => {
    if (fileType === IMPORT_TYPE_ENUM.MD) {
      return ".md";
    }
    if (fileType === IMPORT_TYPE_ENUM.HAR) {
      return "application/json, .har";
    }
    return "application/json";
  }, [fileType]);

  const handleBeforeUpload = useCallback((file: File) => {
    if (!(file?.type === "application/json" || file?.type === "")) {
      message.error(t("supplement.upload_right_file"));
      return false;
    }
    setImportLoading && setImportLoading(true);
    // Return false directly to prevent auto upload (only used as selector)
    return false;
  }, []);

  const importFile = async (file: any, fileType: IMPORT_TYPE_ENUM) => {
    try {
      const chooseFolder = form.getFieldValue("chooseFolder");
      window?.vscode.postMessage({
        action: "importData",
        data: { file, chooseFolder, fileType },
      });

      if (onCancel) {
        onCancel();
      }
    } catch (err) {}
  };

  const handleFileChange = async (info: UploadChangeParam) => {
    const file = info?.file;
    if (file.status === "removed") {
      setPreviewData({ apis: [], models: [], envs: [] });
    } else if (file) {
      const reader = new FileReader();
      reader.onerror = async () => {
        setImportLoading && setImportLoading(false);
        // Force reset after processing file
        setUploadKey(Date.now());
      };
      reader.onload = async () => {
        const text = String(reader.result) || "";
        await completePreviewData(file?.name, text);
        setImportLoading && setImportLoading(false);
        // Force reset after processing file
        setUploadKey(Date.now());
      };
      setImportLoading && setImportLoading(true);

      if ("text" in file) {
        try {
          const content = await file.text(); // Native async API
          setTimeout(async () => {
            await completePreviewData(file?.name, content);
            setImportLoading && setImportLoading(false);
        // Force reset after processing file
            setUploadKey(Date.now());
          }, 100);
        } catch (error) {}
      } else {
        reader.readAsText(file);
      }
    }
  };

  const completePreviewData = async (_fileName: string, text: string) => {
    try {
      setPreviewLoading(true);
      const formData =
      await form.validateFields();

      window?.vscode.postMessage({
        action: "getImportData",
        data: { json: JSON5.parse(text), fileType, formData },
      });
    } catch (err) {
      setPreviewLoading(false);
    }
  };

  const curlImportData = ()=>{
    if (fileType === IMPORT_TYPE_ENUM.CURL) {
      try {
        const parsedValue = parseSafeBash(value);

        window?.vscode.postMessage({
          action: "curlImport",
          data: parsedValue,
        });
      } catch (error) {}
      return;
    }
  }

  const projectImport2 = async () => {
    try {
      setPreviewLoading(true);
      // Filter unchecked data before importing
      const importData = cloneDeep(previewData);
      importData.apis = importData.apis.filter(
        (i) =>
          previewSelectData.apis.includes(i.target_id) ||
          (isArray(previewSelectData?.apiHalfs) &&
            previewSelectData.apiHalfs.includes(i.target_id))
      );
      importData.models = importData.models.filter(
        (i) =>
          previewSelectData.models.includes(i.model_id) ||
          (isArray(previewSelectData?.modelHalfs) &&
            previewSelectData.modelHalfs.includes(i.model_id))
      );
      if (!importData?.global) {
        importData.global = {};
      }
      importData.global.envs = importData.envs.filter((i) =>
        previewSelectData.envs.includes(i.env_id)
      );
      delete importData.envs;
      const {
        api_cover_modal,
        model_cover_modal,
        chooseFolder,
        env_cover_modal,
      } = await form.validateFields();
      window?.vscode.postMessage({
        action: "importData",
        data: { newApis: importData.apis, newEnvs: importData?.global?.envs || [], chooseFolder:chooseFolder || "0", fileType },
      });

      if (onCancel) {
        onCancel();
      }

      setPreview(false);
    } catch (error) {}
    setPreviewLoading(false);
  };

  const previewSwaggerUrlData = async () => {
    try {
      const {
        api_cover_modal,
        model_cover_modal,
        env_cover_modal,
        basePath,
        hostPath,
      } = await form.validateFields();
      setPreviewLoading(true);
      if (fileType === IMPORT_TYPE_ENUM.SWAGGERURL) {
        if (!swaggerUrl) {
          setPreviewLoading(false);
          return message.info(t("supplement.input_url_first1"));
        }
        try {
          let text;
          const result = await axios.get(swaggerUrl);
          text = result?.data || {};
          const formData =
          await form.validateFields();
          window?.vscode.postMessage({
            action: "getImportData",
            data: { json: text, fileType,formData },
          });
        } catch (err: any) {
          message.error(t("supplement.upload_right_file"));
          setPreviewLoading(false);
        }
      }
    } catch (error) {
      setPreviewLoading(false);
    }
  };

  return (
    <>
      {fileType === IMPORT_TYPE_ENUM.CURL && (
        <Flex flex={1} style={{minHeight:0}}>
          <MonacoEditor
            className="curl-monaco-editor"
            onChange={setValue}
            value={value}
          />
        </Flex>
      )}
      {
        <>
          {fileType !== IMPORT_TYPE_ENUM.CURL && (
            <Form
              form={form}
              initialValues={{
                api_cover_modal: "url_and_folder",
                model_cover_modal: "name",
                env_cover_modal: "both",
                basePath: false,
                hostPath: false,
                chooseFolder: "0",
              }}
            >
              {(fileType === IMPORT_TYPE_ENUM.SWAGGER ||
                fileType === IMPORT_TYPE_ENUM.SWAGGERURL) && (
                <div className="import-project-item">
                  <Flex
                    style={{ lineHeight: "32px", marginBottom: "20px" }}
                    align="center"
                    gap={20}
                  >
                    <Flex className="import-project-full-title" gap={8}>
                      {t("supplement.path_handle")}
                      <Tooltip placement="top" title={t("supplement.swagger2")}>
                        <IconFont
                          style={{
                            color: themeToken.iconColor,
                            cursor: "pointer",
                          }}
                          type="icon-tips"
                        />
                      </Tooltip>
                    </Flex>
                    <Flex gap={20}>
                      <Flex gap={8} align="center">
                        {t("settings.import_project.basepath")}
                        <Form.Item noStyle name="basePath">
                          <Switch size="small" />
                        </Form.Item>
                      </Flex>
                      <Flex gap={8} align="center">
                        {t("settings.import_project.host")}
                        <Form.Item noStyle name="hostPath">
                          <Switch size="small" />
                        </Form.Item>
                      </Flex>
                    </Flex>
                  </Flex>
                </div>
              )}

              <div className="import-project-item">
                {!isEqual(fileType, IMPORT_TYPE_ENUM.CURL) && (
                  <div className="import-project-item-title">
                    {(IMPORT_TIP_MAP as any)?.[fileType] ||
                      t("settings.import_project.data_format")}
                  </div>
                )}

                <div className="import-project-item-content">
                  {!includes(
                    [IMPORT_TYPE_ENUM.SWAGGERURL, IMPORT_TYPE_ENUM.CURL],
                    fileType
                  ) && (
                    <Dragger
                      key={uploadKey}
                      className="import-project-upload-content"
                      style={{
                        display: "block",
                      }}
                      accept={accept}
                      beforeUpload={handleBeforeUpload}
                      onChange={handleFileChange}
                      maxCount={1}
                      showUploadList={false}
                      iconRender={() => <IconFont type="icon-link" />}
                    >
                      <p className="ant-upload-drag-icon">
                        <IconFont type="icon-export" style={{ fontSize: 20 }} />
                      </p>
                      <p className="ant-upload-text">
                        {t("settings.import_project.file")}
                      </p>
                      <p
                        className="ant-upload-tips"
                        style={{ color: "var(--font-light-color)" }}
                      >
                        {t(IMPORT_TYPE_MAP[fileType].tips, {
                          fileType,
                        })}
                      </p>
                    </Dragger>
                  )}
                  {fileType === IMPORT_TYPE_ENUM.SWAGGERURL && (
                    <div className="swagger-input" style={{ marginBottom: 24 }}>
                      <Input
                        value={swaggerUrl}
                        onChange={(e) => {
                          if (setSwaggerUrl) {
                            setSwaggerUrl(e?.target?.value);
                          }
                        }}
                        placeholder={t("settings.import_project.input_tip")}
                      />
                    </div>
                  )}
                </div>
              </div>
              <ImportApiPreview
                loading={previewLoading}
                open={preview}
                onCancel={() => setPreview(false)}
                onProjectImport={projectImport2}
                data={previewData}
                importLocation={importLocation}
                fileType={fileType}
                previewSelectData={previewSelectData}
                setPreviewSelectData={setPreviewSelectData}
              />
            </Form>
          )}
        </>
      }
      {fileType === IMPORT_TYPE_ENUM.SWAGGERURL && (
        <Flex justify="end">
          <Button
            loading={previewLoading}
            onClick={previewSwaggerUrlData}
            type="primary"
            className="import-export-now"
          >
            {t("test.http_code.continue")}
          </Button>
        </Flex>
      )}

      {fileType === IMPORT_TYPE_ENUM.CURL && (
        <Flex justify="end">
          <Button
            loading={previewLoading}
            onClick={curlImportData}
            type="primary"
            className="import-export-now"
          >
            {t("common.import_modal.title")}
          </Button>
        </Flex>
      )}

    </>
  );
};

export default Index;
