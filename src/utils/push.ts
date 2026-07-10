import { getEnvListService, getServiceList } from "@/sevices/project";
import { useProjectConfig } from "@/store";
import { EnvList, EnvListItem, ServerItem } from "@/types/envManage";
import { cloneDeep, forEach, isArray } from "lodash";

export const getEnvConficList = async (envCheckedKeys:React.Key[],project_id: string) => {
  const result: {addEnvs:EnvList,diffEnvs:Array<{localEnv:EnvListItem; cloudEnv:EnvListItem}>,newServiceList:ServerItem[],cloudServiceList:ServerItem[]} = {
    addEnvs: [],
    diffEnvs: [],
    newServiceList:[],
    cloudServiceList:[],
  };
  try {
    // Get local environment and service list
    const { envList, serverList : localServerList } = useProjectConfig.getState();
    
     // Get cloud service list
     const serviceList = await getServiceList({ project_id: project_id });
     
     if(isArray(serviceList) && serviceList.length > 0){
       const newServerList:any = [];
       
        // Merge cloud services
       forEach(serviceList,(i)=>{
         let localServiceIndex = localServerList.findIndex((f:any)=>f?.server_id == i?.server_id);
         if(localServiceIndex > -1){
          const localServer = cloneDeep(localServerList[localServiceIndex]);
          if(localServer.name !== i.name){
            localServer.mode = 'update';
          }
          newServerList.push(localServer);
         }else{
           newServerList.push(i);
         }
       });
       // Merge local services
       forEach(localServerList,(i)=>{
        let cloundServiceIndex = serviceList.findIndex((f:any)=>f?.server_id == i?.server_id);
        if(cloundServiceIndex > -1){
        }else{
          const localServer = cloneDeep(i);
          localServer.mode = 'add';
          newServerList.push(localServer);
        }
      });

       result.newServiceList = newServerList;
       result.cloudServiceList = serviceList;
     }
     
    const localEnvList = envList.filter(i=>envCheckedKeys.includes(i?.env_id));
    // Get cloud environment list
    const envRes = await getEnvListService({ project_id: project_id });
    // Compare cloud and local environment lists
    if (isArray(envRes) && envRes.length > 0) {
      forEach(localEnvList, (envItem) => {
        let cloudItem = envRes.find(i => i?.env_id === envItem?.env_id);
        if (cloudItem === undefined) {
          envItem.project_id = project_id;

          // Environment not found in cloud
          result.addEnvs.push(envItem);
        } else {
          // Compare cloud and local environment (fields: environment name, prerequisite services, environment variables) Note: local mock environment does not compare environment name
          if (!['1', '2'].includes(cloudItem?.env_id) && cloudItem?.name != envItem?.name) {
            result.diffEnvs.push({
              localEnv: envItem,
              cloudEnv: cloudItem,
            });
          } else if (Object.keys(cloudItem?.env_var_list || {}).length != Object.keys(envItem?.env_var_list || {}).length) {
            result.diffEnvs.push({
              localEnv: envItem,
              cloudEnv: cloudItem,
            });
          } else if (cloudItem?.server_list?.length != envItem?.server_list?.length) {
            result.diffEnvs.push({
              localEnv: envItem,
              cloudEnv: cloudItem,
            });
          } else {
            let isDiff = false;
            // Compare environment variable list
            Object.keys(cloudItem?.env_var_list || {}).forEach(key => {
              // Different key variable
              if (!envItem?.env_var_list?.[key]) {
                isDiff = true;
              } else if (cloudItem?.env_var_list?.[key]?.value != envItem?.env_var_list?.[key]?.value) {
                isDiff = true;
              } else if (cloudItem?.env_var_list?.[key]?.description != envItem?.env_var_list?.[key]?.description) {
                isDiff = true;
              }
            });
            if (isDiff) {
              result.diffEnvs.push({
                localEnv: envItem,
                cloudEnv: cloudItem,
              });
            }

            // Compare service URIs
            for (let index = 0; index < cloudItem?.server_list.length; index++) {
              const serverItem = cloudItem?.server_list[index];
              const localServerItem = envItem?.server_list.find(i=>i?.server_id == serverItem?.server_id)
              if(localServerItem === undefined){
                result.diffEnvs.push({
                  localEnv: envItem,
                  cloudEnv: cloudItem,
                });
                break;
              }else if(serverItem?.name != localServerItem?.name || serverItem?.uri != localServerItem?.uri){
                result.diffEnvs.push({
                  localEnv: envItem,
                  cloudEnv: cloudItem,
                });
                break;
              }
            }
          }
        }
      });
    }
  } catch (error) {
   }
  return result;
};

export const completeServiceList = (envItem:EnvListItem,newServiceList:ServerItem[])=>{
  if(isArray(newServiceList) && newServiceList.length > 0){
    forEach(newServiceList,(newService)=>{
      // Missing service. Completing.
      if(envItem.server_list.find(i=>i?.server_id === newService.server_id) === undefined){
        envItem.server_list.push(newService);
      }
    });
  }
};