import { message } from 'antd';

import i18next from 'i18next';
import { isArray } from 'lodash';

import { useProjectSetting, useUserConfig } from '@/store';
import { EditFormat, JsonXml2Obj, isJSON, multiObj2simpleObj } from '@/utils/common';

// Beautify JSON
export const beautifyJson = (json: string) => {
  try {
    // Beautify
    const newVal = EditFormat(json).value;
    return newVal;
  } catch (e) {
    return json;
  }
};

// Simplify JSON
export const simplifyJson = (json: string) => {
  try {
    if (isJSON(json)) {
      const newVal = JSON.stringify(multiObj2simpleObj(JSON.parse(json)), null, '\t');
      return newVal;
    } else {
      message.error(i18next.t('supplement.only_json_simple'));
      return undefined;
    }
  } catch (e) {
    return undefined;
  }
};

// Auto generate JSON
export const autoGenerationJson = (json: string) => {
  try {
    const jsonObj = JSON.parse(json);
    return JSON.stringify(jsonObj, null, 2);
  } catch (e) {
    return json;
  }
};

// Extract field description

export const extractDescription = (json: string) => {
  try {
    const jsonObj = JSON.parse(json);
    const description = jsonObj['description'];
    return description;
  } catch (e) {
    return '';
  }
};

export const extractData = async (data: any, json: string) => {
  const { descriptionList, innerDescriptionList } = useProjectSetting.getState();
  const { currentProject } = useUserConfig.getState();
  const val = json || '';

  let descList: any = [];
  // Get current project parameter descriptions
  if (isArray(descriptionList)) {
    descList = descList.concat(descriptionList);
  }

  // Whether smart description library is enabled
  if (currentProject?.is_describe_library === 1) descList = [...descList, ...innerDescriptionList];

  const list = JsonXml2Obj(val, descList, data?.parameter || []);

  if (list.length > 0) {
    message.success(i18next.t('supplement.pick_success'));
  } else {
    message.error(i18next.t('supplement.pick_nothing'));
  }
};
