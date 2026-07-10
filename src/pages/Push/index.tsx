import React, { useState } from 'react';
import { PushWrap } from './style';
import { Flex, message, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { Modal } from '@/components/ui/Modal';
import { useApis, useProjectConfig, useUserConfig } from '@/store';

import { batchSaveApiService, getApisListService } from '@/sevices/apis';
import { cloneDeep, forEach, isArray, isNumber, isPlainObject, some } from 'lodash';
import Left from './Left';
import Right from './Right';
import { completeServiceList, getEnvConficList } from '@/utils/push';
import { PushApiData, PushEnvData } from './type';
import produce from 'immer';
import { addProjectEnvService, addProjectEnvSeverService, updateProjectEnvService, updateProjectEnvSeverService } from '@/sevices/project';

const Push = () => {
  const { t } = useTranslation();

  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [conflictType, setConflictType] = useState<string>('manual');
  const envList = useProjectConfig((store) => store?.envList) || [];
  const [tabValue, setTabValue] = useState<'apis' | 'env'>('apis');
  const [modal, contextHolder] = Modal.useModal();
  const [pushEnvData, setPushEnvData] = useState<Partial<PushEnvData>>({
    checkedKeys: [],
    conflictType: 'mergeCloud',
    conflictItems: [],
    conflictCheckedKeys: [],
    addEnvs: [],
    uploadItems: [],
    newServiceList: [],
    cloudServiceList: []
  });

  const [pushApiData, setPushApiData] = useState<Partial<PushApiData>>({
    checkedKeys: [],
    conflictType: 'local',
    conflictItems: [],
    conflictCheckedKeys: [],
  });


  const apiOriginDetailsList = useApis((store) => store.apiOriginDetailsList);

  const localProjectApisVersion = useApis((store) => store.localProjectApisVersion);
  const { currentProject } = useUserConfig(
    useShallow(({ currentProject }) => {
      return {
        currentProject,
      };
    })
  );

  const serverList = useProjectConfig((store) => store.serverList);

  const updatePushApiData = (key: any, value?: any) => {
    let newPushApiData = produce(pushApiData, (draft: any) => {
      if (isPlainObject(key)) {
        Object.keys(key).forEach(k => {
          draft[k] = key[k];
        });
      } else {
        draft[key] = value;
      }
    });
    setPushApiData(newPushApiData);
  };

  const updatePushEnvData = (key: any, value?: any) => {
    let newPushEnvData = produce(pushEnvData, (draft: any) => {
      if (isPlainObject(key)) {
        Object.keys(key).forEach(k => {
          draft[k] = key[k];
        });
      } else {
        draft[key] = value;
      }
    });
    setPushEnvData(newPushEnvData);
  };

  const handlePush = async () => {
    if (!currentProject?.project_id || currentProject?.project_id === '-1') {
      message.error(t('common.choose_target_tip'));
      return;
    }

    let checkedKeys = pushApiData?.checkedKeys || [];

    let envCheckedKeys = pushEnvData?.checkedKeys || [];

    if (checkedKeys.length <= 0 && envCheckedKeys.length <= 0) {
      message.error(t('common.least_one_item_tip'));
      return;
    }
    const localApiList = cloneDeep(apiOriginDetailsList);
    let checkedItems = localApiList.filter(i => checkedKeys.concat(halfCheckedKeys).includes(i?.target_id));

    // Handle environment and service conflicts (get conflicting environment list)
    const envConflictList = await getEnvConficList(pushEnvData?.checkedKeys || [], currentProject?.project_id);

    // Get all API versions from cloud
    const res = await getApisListService({ project_id: currentProject.project_id });
    const cloudList = res?.list || [];

    // Conflicting API list
    const conflictList: any = [];
    // Conflicting API ID list
    const conflictIdList: Array<string> = [];

    // Local API version records for target project
    let localApisVersion: any = localProjectApisVersion?.[currentProject.project_id] || {};

    // Compare local and cloud for conflicts, prefer using recorded version numbers
    forEach(checkedItems, (item) => {
      if (some(cloudList, (i) => {
        let localVersion = localApisVersion?.[i?.target_id];
        // If local has version record, prefer using local project version record for comparison
        if (isNumber(localVersion)) {
          return i?.target_id === item?.target_id && ['api', 'sse', 'websocket2', 'socketio', 'folder', 'graphql'].includes(item?.target_type) && i?.version > localVersion;
        } else {
          return i?.target_id === item?.target_id && ['api', 'sse', 'websocket2', 'socketio', 'folder', 'graphql'].includes(item?.target_type) && i?.version > item.version;
        }
      })) {
        conflictList.push({ ...item, parent_id: '0' });
        conflictIdList.push(item?.target_id);
      }
    });
    // API or environment has conflict, proceed to conflict resolution step
    if (conflictList.length > 0 || envConflictList.diffEnvs.length > 0) {
      conflictList.sort((a:any, b:any) => {
        if (a.target_type === 'folder' && b.target_type !== 'folder') {
          return -1; 
        } else if (a.target_type !== 'folder' && b.target_type === 'folder') {
          return 1;
        }
        return 0; 
      })
      if (conflictType === 'manual') {
        updatePushApiData({
          conflictItems: conflictList,
          conflictCheckedKeys: conflictList.map((i: any) => i?.target_id)
        });
        updatePushEnvData({
          conflictItems: envConflictList.diffEnvs,
          addEnvs: envConflictList?.addEnvs || [],
          newServiceList: envConflictList?.newServiceList || [],
          conflictCheckedKeys: envConflictList.diffEnvs.map((i) => i?.localEnv?.env_id),
          cloudServiceList: envConflictList?.cloudServiceList || []
        });
        return;
      } else if (conflictType === 'local') {
        // Use local data to resolve conflicts directly
      } else if (conflictType === 'cloud') {
        // Filter out conflicting items, do not submit to cloud
        checkedItems = checkedItems.filter(i => !conflictIdList.includes(i?.target_id))
      }
    }

    setSpinning(true);
    // Update project ID before upload
    forEach(checkedItems, (item) => {
      item.project_id = currentProject.project_id;
    });
    try {

      // Upload environments without conflicts
      if (isArray(envConflictList?.addEnvs) && envConflictList.addEnvs.length > 0) {
        // Before uploading environments, upload necessary services from the service list first
        for (let index = 0; index < envConflictList.newServiceList.length; index++) {
          const newService = envConflictList.newServiceList[index];
          if (newService?.mode === 'add') {
            await addProjectEnvSeverService({ ...newService, project_id: currentProject.project_id });

          } else if (newService?.mode === 'update') {
            await updateProjectEnvSeverService({ ...newService, project_id: currentProject.project_id });
          }
        }

        for (let index = 0; index < envConflictList.addEnvs.length; index++) {
          const localEnv = envConflictList.addEnvs[index];
          // Complete service list
          completeServiceList(localEnv, envConflictList.newServiceList);
          await addProjectEnvService({ ...localEnv, project_id: currentProject.project_id });
        }
      }

      if (checkedItems.length <= 0) {
        // Close upload page and show success message
        window?.vscode.postMessage({
          action: 'pushSuccess',
        });
        return;
      }

      // Upload APIs without conflicts
      const result = await batchSaveApiService({ project_id: currentProject.project_id, apis: checkedItems });
      // After uploading APIs, use cloud's latest version number to overwrite local version
      if (isArray(result?.list) && result.list.length > 0) {
        forEach(result.list, (i) => {
          let localIndex = localApiList.findIndex(it => it?.target_id === i?.target_id);
          if (isNumber(i.version)) {
            localApiList[localIndex].version = i.version;
          }
        });
        // Save updated version data locally
        window?.vscode.postMessage({
          action: 'setApiList',
          data: localApiList
        });
      }
      // Close upload page and show success message
      window?.vscode.postMessage({
        action: 'pushSuccess',
      });
    } catch (error) { }
    setSpinning(false);
  };
  const conflictPush = async (keys?: React.Key[], uploadItem?: any[]) => {
    let checkedKeys = (pushApiData?.checkedKeys || []).concat(halfCheckedKeys);
    
    setSpinning(true);
    try {
      //#region Upload environments start
      // Before uploading environments, upload necessary services from the service list first
      if (isArray(pushEnvData?.newServiceList) && pushEnvData.newServiceList.length > 0) {
        for (let index = 0; index < pushEnvData.newServiceList.length; index++) {
          const newService = pushEnvData.newServiceList[index];
          if (newService?.mode === 'add') {
            await addProjectEnvSeverService({ ...newService, project_id: currentProject.project_id });

          } else if (newService?.mode === 'update') {
            await updateProjectEnvSeverService({ ...newService, project_id: currentProject.project_id });
          }
        }
      }

      // Upload new environments
      if (isArray(pushEnvData?.addEnvs) && pushEnvData.addEnvs.length > 0) {
        for (let index = 0; index < pushEnvData.addEnvs.length; index++) {
          const localEnv = pushEnvData.addEnvs[index];
          // Complete service list
          completeServiceList(localEnv, pushEnvData?.newServiceList || []);
          await addProjectEnvService({ ...localEnv, project_id: currentProject.project_id });
        }
      }

      // Upload modified environments
      let uploadArrs = pushEnvData?.uploadItems;
      if (isArray(uploadItem)) {
        uploadArrs = uploadItem;
      }
      if (isArray(uploadArrs) && uploadArrs.length > 0) {
        for (let index = 0; index < uploadArrs.length; index++) {
          const localEnv = uploadArrs[index];
          // Complete service list
          completeServiceList(localEnv, pushEnvData?.newServiceList || []);
          await updateProjectEnvService({ ...localEnv, project_id: currentProject.project_id });
        }
      }
      //#endregion Upload environments end

      //#region Upload APIs start
      const localApiList = cloneDeep(apiOriginDetailsList);
      const checkedItems = localApiList.filter(i => {
        if (keys) {
          return keys.includes(i?.target_id);
        } else {
          return checkedKeys.includes(i?.target_id);
        }
      });
      // Update project ID before upload
      forEach(checkedItems, (item) => {
        item.project_id = currentProject.project_id;
      });
      if (checkedItems.length <= 0) {
        // Close upload page and show success message
        window?.vscode.postMessage({
          action: 'pushSuccess',
        });
        return;
      }
      const result = await batchSaveApiService({ project_id: currentProject.project_id, apis: checkedItems });

      // After uploading APIs, use cloud's latest version number to overwrite local version
      if (isArray(result?.list) && result.list.length > 0) {
        forEach(result.list, (i) => {
          let localIndex = localApiList.findIndex(it => it?.target_id === i?.target_id);
          if (isNumber(i.version)) {
            localApiList[localIndex].version = i.version;
          }
        });
        // Save updated version data locally
        window?.vscode.postMessage({
          action: 'setApiList',
          data: localApiList
        });
      }
      //#endregion Upload APIs end

      // Close upload page and show success message
      window?.vscode.postMessage({
        action: 'pushSuccess',
      });
    } catch (error) { }

    setSpinning(false);
  };

  const handleFix = async () => {
    try {
      let envConflictItems = pushEnvData?.conflictItems || [];
      let conflictItems = pushApiData?.conflictItems || [];
      if (tabValue === 'apis') {
        let checkedKeys = (pushApiData?.checkedKeys || []).concat(halfCheckedKeys);
        let useClond = pushApiData?.conflictType;
        let conflictCheckedKeys = pushApiData?.conflictCheckedKeys || [];
        if (useClond === undefined) {
          message.error(t('common.select_conflict_mode_tip'));
          return;
        }

        if (useClond === 'local') {
          // Use local data
          updatePushApiData('conflictItems', conflictItems.filter((i: any) => !conflictCheckedKeys.includes(i?.target_id)));
          // Handle last conflict and resubmit data to cloud
          if (conflictCheckedKeys.length === conflictItems.length) {
            if (envConflictItems.length <= 0) {
              conflictPush();
            } else {
              setTabValue('env');
            }
          }
        } else if (useClond === 'cloud') {
          // Use cloud data
          updatePushApiData({
            conflictItems: conflictItems.filter((i: any) => !conflictCheckedKeys.includes(i?.target_id)),
            checkedKeys:checkedKeys.filter((i: React.Key) => !conflictCheckedKeys.includes(i))
          });

          // Handle last conflict and resubmit data to cloud
          if (conflictCheckedKeys.length === conflictItems.length) {
            if (envConflictItems.length <= 0) {
              conflictPush(checkedKeys.filter((i: React.Key) => !conflictCheckedKeys.includes(i)));
            } else {
              setTabValue('env');
            }
          }
        }
        return;
      }
      if (tabValue === 'env') {
        let conflictCheckedKeys = pushEnvData?.conflictCheckedKeys || [];
        let uploadItems = cloneDeep(pushEnvData?.uploadItems) || [];
        switch (pushEnvData?.conflictType) {
          case 'local':
            const newServiceList = pushEnvData?.newServiceList || [];

            // Check for service changes before conflict resolution, show modal if changed
            if (newServiceList.length !== serverList.length) {
              const res = await modal?.confirm({
                title: 'Push Confirmation',
                content: <Flex vertical gap={20}>
                  <Flex gap={8} vertical style={{ padding: 12, background: 'var(--color-bg-page)' }}>
                    <Typography.Text style={{ color: 'var(--font-content-color)' }}>
                      After selecting "Use Local Data", the system will automatically add any missing cloud services to ensure everything functions properly.
                    </Typography.Text>
                  </Flex>
                  <span>
                    Do you want to continue?
                  </span>
                </Flex>,
                width: 800,
                okText: 'Continue',
                cancelText: 'Cancel',
              });
              if (!res) {
                return;
              }
            }

            // Use local data (but need to merge services)
            forEach(envConflictItems, (i) => {
              let item = cloneDeep(i);

              // Checked environments
              if (conflictCheckedKeys.includes(i?.localEnv?.env_id)) {
                completeServiceList(item.localEnv, newServiceList);
              }
              uploadItems.push(item.localEnv);
            });

            updatePushEnvData({
              uploadItems,
              conflictItems: envConflictItems.filter((i: any) => !conflictCheckedKeys.includes(i?.localEnv?.env_id))
            });

            break;
          case 'cloud':
            // Use cloud data
            updatePushEnvData('conflictItems', envConflictItems.filter((i: any) => !conflictCheckedKeys.includes(i?.localEnv?.env_id)));
            break;
          case 'mergeCloud':
            // Merge data, use cloud data for conflicting fields
            forEach(envConflictItems, (i) => {
              let item = cloneDeep(i);
              // Checked environments
              if (conflictCheckedKeys.includes(i?.localEnv?.env_id)) {
                // Merge cloud services.
                if (isArray(i?.cloudEnv?.server_list) && i.cloudEnv.server_list.length > 0) {
                  forEach(i.cloudEnv.server_list, (cloudService) => {
                    let localServiceIndex = item.localEnv.server_list.findIndex((f: any) => f?.server_id == cloudService?.server_id);
                    if (localServiceIndex > -1) {
                      item.localEnv.server_list[localServiceIndex] = cloudService;
                    } else {
                      item.localEnv.server_list.push(cloudService);
                    }
                  });
                }
                // Use cloud environment name
                item.localEnv.name = item.cloudEnv.name;

                // Use cloud data for environment variables
                item.localEnv.env_var_list = {
                  ...item?.localEnv?.env_var_list || {},
                  ...item?.cloudEnv?.env_var_list || {}
                };

                // Use cloud is_private setting
                item.localEnv.is_private = item.cloudEnv.is_private;
              }
              uploadItems.push(item.localEnv);
            });

            updatePushEnvData({
              uploadItems,
              conflictItems: envConflictItems.filter((i: any) => !conflictCheckedKeys.includes(i?.localEnv?.env_id))
            });
            break;
          case 'mergeLocal':
            // Merge data, use local data for conflicting fields
            forEach(envConflictItems, (i) => {
              let item = cloneDeep(i);
              // Checked environments
              if (conflictCheckedKeys.includes(i?.localEnv?.env_id)) {
                // Merge cloud services.
                if (isArray(i?.cloudEnv?.server_list) && i.cloudEnv.server_list.length > 0) {
                  forEach(i.cloudEnv.server_list, (cloudService) => {
                    let localServiceIndex = item.localEnv.server_list.findIndex((f: any) => f?.server_id == cloudService?.server_id);
                    if (localServiceIndex > -1) {
                    } else {
                      item.localEnv.server_list.push(cloudService);
                    }
                  });
                }

                // Environment variables prefer local data
                item.localEnv.env_var_list = {
                  ...item?.cloudEnv?.env_var_list || {},
                  ...item?.localEnv?.env_var_list || {}
                };

                // Use cloud is_private setting
                item.localEnv.is_private = item.cloudEnv.is_private;
              }
              uploadItems.push(item.localEnv);
            });

            updatePushEnvData({
              uploadItems,
              conflictItems: envConflictItems.filter((i: any) => !conflictCheckedKeys.includes(i?.localEnv?.env_id))
            });
            break;
          default:
            break;
        }
        // Handle last conflict and resubmit data to cloud
        if (conflictCheckedKeys.length === envConflictItems.length) {
          if (conflictItems.length <= 0) {
            conflictPush(pushApiData?.checkedKeys || [], uploadItems);
          } else {
            setTabValue('apis');
          }
        }
      }
    } catch (error) { }
  };

  const handlePushCancel = () => {
    updatePushApiData({
      conflictItems:[],
      conflictCheckedKeys:[]
    });
    updatePushEnvData({ conflictItems: [], conflictCheckedKeys:[] , newServiceList:[], cloudServiceList:[] ,addEnvs: [], uploadItems: [] });
    message.error(t('common.push_faied'));
  };

  const result = {
    conflictType,
    setConflictType,
    handlePush,
    halfCheckedKeys,
    setHalfCheckedKeys,
    conflictPush,
    handleFix,
    pushEnvData,
    updatePushEnvData,
    pushApiData,
    updatePushApiData,
    tabValue,
    setTabValue,
    handlePushCancel
  };

  return (
    <Spin tip={t('common.loading')} spinning={spinning}>
      <PushWrap>
        <Left {...result} />
        <Right {...result} />
      </PushWrap>
      {contextHolder}
    </Spin>
  );
};
export default Push;