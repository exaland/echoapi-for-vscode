import { useProjectConfig, useUserConfig } from "@/store";
import { ImportConfig } from "@/types/project/export";
import { getSubstring } from "@/utils/common";
import { snowflakeId } from "apipost-tools";
import { cloneDeep, has, isArray, isEmpty, isPlainObject, keys } from "lodash";
import {
  completionApis,
  completionAttributes,
  completionCodes,
  completionCustomFunc,
  completionCustomRules,
  completionDbLink,
  completionDesLibrary,
  completionEnv,
  completionGlobalParam,
  completionGlobalVars,
  completionMarks,
  completionModels,
  completionSamples,
  completionServers,
} from "@/utils/exportutils/apiToSelf";
import {
  completionSwaggerApis,
  completionSwaggerEnv,
} from "@/utils/exportutils/apiToSwagger";
import { ApiDetailsData } from "@/types/apis/api";

export const getExportData = (apiData: ApiDetailsData, rest: any = {}) => {
  const { currentProject } = useUserConfig.getState();
  const { envList } = useProjectConfig.getState();
  const envs = envList
    ?.filter((item) => item?.env_id !== "2")
    ?.map(({ env_var_list, name, server_list }) => {
      const url = server_list?.find((e) => e?.server_id === "1")?.uri || "";
      return {
        env_var_list,
        url,
        name,
      };
    });
  return {
    project: currentProject,
    apis: [apiData],
    envs,
    models: [],
    mock_rules: [],
    ...rest,
  };
};

const getApiOrders = (node: any) => {
  try {
    const initialOrderKeys = isArray(node?.ECHOAPI_ORDERS)
      ? node.ECHOAPI_ORDERS
      : [];
    const properties = isPlainObject(node?.properties) ? node.properties : {};
    const propertiesKeys = keys(properties);
    const orderKeysInfo = propertiesKeys.reduce(
      (pre, e) => {
        if (pre.orderKeys.includes(e) === false) {
          pre.isEqual = false;
          pre.orderKeys.push(e);
        }
        return pre;
      },
      { orderKeys: initialOrderKeys, isEqual: true },
    );
    if (!orderKeysInfo.isEqual) {
      return orderKeysInfo.orderKeys;
    }
    return initialOrderKeys;
  } catch (err) {
    return [];
  }
};

export const recursionSetSchemaOrder = (originSchema: any) => {
  try {
    const schema = cloneDeep(originSchema);
    if (
      has(schema, "properties") &&
      Object.prototype.toString.call(schema?.properties) === "[object Object]"
    ) {
      schema["ECHOAPI_ORDERS"] = getApiOrders(schema || {});
      schema["properties"] = keys(schema?.properties)?.reduce(
        (pre: any, key) => {
          if (key && !isEmpty(schema?.properties[key])) {
            pre[key] = recursionSetSchemaOrder(schema?.properties[key]);
          }
          return pre;
        },
        {},
      );
    }
    if (schema?.type === "array" && has(schema, "items")) {
      if (
        has(schema?.items, "properties") &&
        Object.prototype.toString.call(schema?.items?.properties) ===
          "[object Object]"
      ) {
        schema.items = recursionSetSchemaOrder(schema?.items);
      }
    }
    return schema;
  } catch (err) {
    return originSchema;
  }
};

export const apiConverFormat = (json: any, project_id: string) => {
  const {
    name: projectName = "",
    intro: projectIntro = "",
    global,
    models,
    apis,
    samples,
  } = json || {};
  const {
    envs,
    servers,
    global_vars = {},
    global_param = {},
    codes,
    marks,
    attributes,
    mock_custom_rules,
    db_link,
    describe_library,
    custom_func,
  } = global || {};
  const serversMap = servers?.reduce(
    (pre: { [key: string]: string }, item: any) => {
      if (["1", "2"].includes(item?.server_id)) {
        pre[item?.server_id] = item?.server_id;
      } else {
        pre[item?.server_id] = snowflakeId();
      }
      return pre;
    },
    {},
  );
  const envMap: { [k: string]: string } = {};
  const modelsMap = models?.reduce(
    (pre: { [key: string]: string }, e: any) => {
      if (e?.model_id && !has(pre, e?.model_id)) {
        pre[e?.model_id] = snowflakeId();
      }
      if (e?.parent_id && !has(pre, e?.parent_id)) {
        pre[e?.parent_id] = snowflakeId();
      }
      return pre;
    },
    { "0": "0" } as { [key: string]: string },
  );
  const apiMap = apis?.reduce(
    (pre: { [key: string]: string }, e: any) => {
      if (e?.target_id && !has(pre, e?.target_id)) {
        pre[e?.target_id] = snowflakeId();
      }
      if (e?.parent_id && !has(pre, e?.parent_id)) {
        pre[e?.parent_id] = snowflakeId();
      }
      return pre;
    },
    { "0": "0" } as { [key: string]: string },
  );
  const sampleMap = samples?.reduce(
    (pre: { [key: string]: string }, e: any) => {
      if (e?.sample_id && !has(pre, e?.sample_id)) {
        pre[e?.sample_id] = snowflakeId();
      }
      if (e?.parent_id && !has(pre, e?.parent_id)) {
        pre[e?.parent_id] = snowflakeId();
      }
      return pre;
    },
    { "0": "0" },
  );

  try {
    // Do not change the order
    const res = {
      project_id,
      name: getSubstring(projectName, 64),
      intro: getSubstring(projectIntro, 1024),
      global: {
        envs: completionEnv(envs, envMap, serversMap),
        servers: completionServers(servers, serversMap),
        global_vars: completionGlobalVars(global_vars),
        global_param: completionGlobalParam(global_param, true),
        codes: completionCodes(codes),
        marks: completionMarks(marks, project_id),
        attributes: completionAttributes(attributes, project_id),
        mock_custom_rules: completionCustomRules(mock_custom_rules, project_id),
        db_link: completionDbLink(db_link, project_id),
        describe_library: completionDesLibrary(describe_library, project_id),
        custom_func: completionCustomFunc(custom_func),
      },
      models: completionModels(models, modelsMap),
      apis: completionApis(apis, apiMap, modelsMap, serversMap, project_id),
      samples: completionSamples(
        samples,
        apiMap,
        sampleMap,
        modelsMap,
        project_id,
      ),
    };
    return res;
  } catch (err) {
    return {};
  }
};

export const swaggerConverFormat = (
  json: any,
  baseConfig: ImportConfig,
  project_id: string,
) => {
  const { env, apis } = json || {};
  const res = {
    global: {},
  };
  completionSwaggerEnv(res, env);
  completionSwaggerApis(res, apis, project_id);
  return res;
};
