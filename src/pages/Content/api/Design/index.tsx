import { useMemo } from 'react';
import { MonacoEditor } from '@/components/business';
import { useDebounce, useSafeState } from 'ahooks';
import produce from 'immer';
import { DirectionType } from '@/types/common';
import yaml from 'js-yaml';
import { ResizablePanels, SuspenseContent } from '@/components/business';
import { isEqual } from 'lodash';
import { useProjectConfig, useUserConfig } from '@/store';
import DesignRequest from '@/components/business/DesignRequest';
import Docs from './Docs';
import Header from './Header';
import ToolBar from './ToolBar';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { ApiComponentType, ApiDetailsData, OpenApiData, OpenApiMainObj } from '@/types/apis/api';
import { genUrlByQuery } from '@/utils/apis';

const panelProps = {
  defaultSize: 50,
  minSize: 5,
  collapsible: true,
  collapsedSize: 5,
};

const ApiDesign: FC<ApiComponentType> = ({ apisData, onApisDataChange }) => {
  const { t } = useTranslation();
  const [apiScreenDirection] = useSafeState<DirectionType>('horizontal');
  const currentProject = useUserConfig((state) => state.currentProject);
 
  const envList = useProjectConfig((state) => state.envList);
  
  const [footerType, setFooterType] = useSafeState<'Form' | 'Code'>('Form');
  const [preView, setPreView] = useSafeState<boolean>(true);
  const handleDirectionChange = (direction: DirectionType) => {
  };

  const onRequestDataChange = (val: any) => {
    onApisDataChange(produce((apisData as ApiDetailsData), (draft) => {
      draft.request = val;
      // Query parameters updated and appended to URL bar
      if (!isEqual(draft.request.query, apisData.request.query)) {
        draft.url = genUrlByQuery(
          draft.url,
          draft.request.query?.parameter,
          draft.request.query?.query_add_equal
        );
      }
    }));
  }

  const onOpenApiDataChange = (val: OpenApiData) => {
    
    onApisDataChange(produce((apisData as ApiDetailsData), (draft) => {
      draft.open_api = val;
    }));
  }

  const onOpenApiMainChange = (val: OpenApiMainObj) => {
    onOpenApiDataChange(produce((apisData.open_api as OpenApiData), (draft) => {
      let urlObj;
      for (const key in draft) {
        urlObj = draft[key];
        break;
      }

      for (const key in urlObj) {
        urlObj[key] = val;
        break;
      }
    }));
  };

  const openApiMainObj: OpenApiMainObj = useMemo(() => {
    let urlObj;
    for (const key in apisData?.open_api) {
      urlObj = apisData.open_api[key];
      break;
    }

    let methodObj;
    for (const key in urlObj) {
      methodObj = urlObj[key];
      break;
    }
    return methodObj as OpenApiMainObj;
  }, [apisData?.open_api]);

  const swaggerJson = useMemo(() => {
    const servers = envList
      ?.filter((item) => item?.env_id !== '2')
      ?.map(({ env_var_list, name, server_list }) => {
        const url = server_list?.find((e) => e?.server_id === '1' || e?.is_default === 1)?.uri || '';
        return {
          variables: Object.keys(env_var_list || {}).reduce((pre: any, curKey) => {
            const cur = env_var_list[curKey];
            pre[curKey] = {
              default: cur?.current_value || cur?.value || '',
              description: cur?.description || ''
            }
            return pre;
          }, {}),
          url,
          description: name || '',
        };
      });
    return {
      info: {
        "title": currentProject?.name || 'Open Api',
        "description": '',
        "version": "1.0.0"
      },
      openapi: '3.0.3',
      servers: servers,
      paths: {
        ...apisData?.open_api || {}
      }
    }
  }, [currentProject, apisData?.open_api, envList]);

  const debounceSwaggerJson = useDebounce(swaggerJson, {
    wait: 500,
  });

  return (
    <>
      <ToolBar apisData={apisData as ApiDetailsData} onApisDataChange={onApisDataChange} />
      <header>
        <Header setPreView={setPreView} apisData={apisData} openApiData={apisData?.open_api as OpenApiData} onOpenApiDataChange={onOpenApiDataChange} />
      </header>
      <main style={{ overflow: 'hidden' }}>
        {preView ?
          <ResizablePanels
            panelGroupProps={{
              autoSaveId: 'api_debug_container_resize_save_id',
              direction: apiScreenDirection,
            }}
            leftPanelProps={{ ...panelProps, collapseTitle: t('supplement.request_panel') }}
            rightPanelProps={{ ...panelProps, collapseTitle: t('common.docs') }}
            leftPanel={
              <SuspenseContent>
                {footerType == 'Form' ?
                  <DesignRequest
                    openApiMainObj={openApiMainObj}
                    onOpenApiMainChange={onOpenApiMainChange}
                  /> :
                  <div style={{ height: '100%',paddingTop:12 }}>
                    <MonacoEditor
                      language={'yaml'}
                      height="100%"
                      value={yaml.dump(swaggerJson)}
                      onChange={(val) => {
                        try {
                          const jsonData = yaml.load(val);
                          if (isPlainObject(jsonData)) {
                            let openApi = jsonData;
                            if (isPlainObject(openApi.paths)) {
                              let newOpenApi;
                              for (const key in openApi.paths) {
                                newOpenApi = { [key]: openApi.paths[key] };
                                break;
                              }
                              if (isPlainObject(newOpenApi)) {
                                onOpenApiDataChange(newOpenApi as OpenApiData);
                              }
                            }
                          }
                        } catch (error) { }
                      }}
                    />
                  </div>}
              </SuspenseContent>
            }
            rightPanel={
              <SuspenseContent>
                <Docs apisData={apisData} swaggerJson={debounceSwaggerJson} />
              </SuspenseContent>
            }
            onDirectionChange={handleDirectionChange}
          />
          :
          <SuspenseContent>
            {footerType == 'Form' ?
              <DesignRequest
                openApiMainObj={openApiMainObj}
                onOpenApiMainChange={onOpenApiMainChange}
              /> :
              <div style={{ height: '100%',paddingTop:12 }}>
                <MonacoEditor
                  language={'yaml'}
                  height="100%"
                  value={yaml.dump(swaggerJson)}
                  onChange={(val) => {
                    try {
                      const jsonData = yaml.load(val);
                      if (isPlainObject(jsonData)) {
                        let openApi = jsonData;
                        if (isPlainObject(openApi.paths)) {
                          let newOpenApi;
                          for (const key in openApi.paths) {
                            newOpenApi = { [key]: openApi.paths[key] };
                            break;
                          }
                          if (isPlainObject(newOpenApi)) {
                            onOpenApiDataChange(newOpenApi as OpenApiData);
                          }
                        }
                      }
                    } catch (error) { }
                  }}
                />
              </div>}
          </SuspenseContent>
        }

      </main>
      <Footer footerType={footerType} setFooterType={setFooterType} />
    </>
  );
};

export default ApiDesign;