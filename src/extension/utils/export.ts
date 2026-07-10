import * as vscode from 'vscode';
import { getApiList, getCurrentProjectConfig, getUserConfig } from '../utils';
import { EXPORT_TYPE_ENUM } from '@/constants/settings';
import { exportMethod } from '@/utils/export';
import { getExportData as getExportApiData  } from '@/extension/utils/share';

export const getExportData =async (option:{type:string,version:string}, context: vscode.ExtensionContext)=>{
  const result = {
    fileName:'',
    fileText:''
   };
   const type = option?.type || 'echoapi';
   const version =option?.version || '3.0';
   const user_config = getUserConfig(context);
   const project_config = getCurrentProjectConfig(context);
   const apiList = getApiList(context);
   
  const json = getExportApiData({apis:apiList || []}, context);

  if(type === EXPORT_TYPE_ENUM.postman){
    result.fileName = `${user_config?.currentProject?.name || ''}_echoapi_postman.json`;
    const swaggerRes = await exportMethod.apiToPostman(json);
		if (swaggerRes.status === 'success') {
      result.fileText=JSON.stringify(swaggerRes.data,null,'\t');
		} else {
			result.fileText=JSON.stringify('',null,'\t');
      vscode.window.showErrorMessage(swaggerRes.message);
      throw new Error(swaggerRes.message);
		}
    return result;
  }else if(type === EXPORT_TYPE_ENUM.echoapi){
    const echoApiData = {
      "project_id": user_config?.currentProject?.project_id,
      "name": user_config?.currentProject?.name,
      "intro": user_config?.currentProject?.intro,
      "global": {
        "envs":project_config?.envList || [],
        "servers": project_config?.serverList || [],
        "global_vars": project_config?.globalVars || {},
        "global_param": project_config?.globalParams || {} ,
      },
      "apis": apiList || [] ,
    }
    result.fileName = `${user_config?.currentProject?.name || ''}_echoapi.json`;
    result.fileText=JSON.stringify(echoApiData,null,'\t');
    return result;
  }else if(type === EXPORT_TYPE_ENUM.swagger){
    result.fileName = `${user_config?.currentProject?.name || ''}_openapi_${3.0}.json`;
    const res = await exportMethod.apiToSwagger(json, version, 'en');
    if (res.status === 'success') {
      result.fileText=JSON.stringify(res.data,null,'\t');
    } else if (res?.status === 'error') {
      vscode.window.showErrorMessage(res?.message);
      throw new Error(res?.message);
    }
    return result;
  }

   return result;
};