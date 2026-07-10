import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { isArray } from 'lodash';

export const isWin = () => {
  const platform = process.platform;

  if (platform.includes('win')) {
    // Write Windows-specific logic here
    return true;
  }
  return false;
}

export const existFileSync = (context: vscode.ExtensionContext, key: string) => {
  try {
    const filePath = path.join(context.globalStorageUri.fsPath, `${key}.json`);
    const cachePath = path.join(os.homedir(), 'echoapi_for_vscode', `${key}.json`);

    if (isWin() && key.includes(':')) {
      const newCachePath = path.join(os.homedir(), 'echoapi_for_vscode', `${key.replace(/:/g, '_')}.json`);
      try {
        if (fs.existsSync(newCachePath)) {
          return true
        }
      } catch (error) {
      }
    }

    try {
      if (fs.existsSync(cachePath)) {
        return true
      }
    } catch (error) {
    }

    try {
      if (fs.existsSync(filePath)) {
        return true
      }
    } catch (error) {
    }

    return false;
  } catch (error) {

    return false;
  }
}

export const getDataFromGlobalStorage = (context: vscode.ExtensionContext, key: string, defaultValue = {}) => {
  try {
    const filePath = path.join(context.globalStorageUri.fsPath, `${key}.json`);

    const cachePath = path.join(os.homedir(), 'echoapi_for_vscode', `${key}.json`);

    let data: any;

    let result: any = defaultValue;

    let existCachePath = false;

    try {
      if (isWin() && key.includes(':')) {
        const newCachePath = path.join(os.homedir(), 'echoapi_for_vscode', `${key.replace(/:/g, '_')}.json`);
        if (fs.existsSync(newCachePath)) {
          data = fs.readFileSync(newCachePath, 'utf-8');
          result = JSON.parse(data);
          existCachePath = true;
        } else if (fs.existsSync(cachePath)) {
          try {
            data = fs.readFileSync(cachePath, 'utf-8');
            result = JSON.parse(data);
            existCachePath = true;
            fs.writeFileSync(newCachePath, JSON.stringify(result, null, 2), 'utf-8');
            fs.unlinkSync(cachePath);
          } catch (error) {
            data = fs.readFileSync(cachePath, 'utf-8');
            result = JSON.parse(data);
            existCachePath = true;
          }
        }
      } else {
        // Prioritize cache path data
        if (fs.existsSync(cachePath)) {
          data = fs.readFileSync(cachePath, 'utf-8');
          result = JSON.parse(data);
          existCachePath = true;
        }
      }
    } catch (error) { }
    try {
      if (fs.existsSync(filePath) && !existCachePath) {
    // Get data from extension directory path
        data = fs.readFileSync(filePath, 'utf-8');
        result = JSON.parse(data);
        // Write data to cache
        setDataToGlobalStorage(context, key, result);
      }
    } catch (error) { }

    if (isArray(defaultValue) && !isArray(result)) {
      result = [];
    }
    return result;
  } catch (error) {
  };
  return defaultValue || {};
};

export const setDataToGlobalStorage = (context: vscode.ExtensionContext, key: string, value: any) => {
  try {
    const filePath = path.join(context.globalStorageUri.fsPath, `${key}.json`);

    const cachePath = path.join(os.homedir(), 'echoapi_for_vscode', `${key}.json`);

    try {
      // Check if directory exists, create if not
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (error) { }

    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');

    try {
      // Check if cache directory exists, create if not
      const catchDir = path.dirname(cachePath);
      if (!fs.existsSync(catchDir)) {
        fs.mkdirSync(catchDir, { recursive: true });
      }
    } catch (error) { }

    if (isWin() && key.includes(':')) {
      const newCachePath = path.join(os.homedir(), 'echoapi_for_vscode', `${key.replace(/:/g, '_')}.json`);

      try {
        fs.writeFileSync(newCachePath, JSON.stringify(value, null, 2), 'utf-8');
        if (fs.existsSync(cachePath)) {
          fs.unlinkSync(cachePath);
        }

      } catch (error) {
        fs.writeFileSync(cachePath, JSON.stringify(value, null, 2), 'utf-8');
      }
    } else {
      // Write to cache file
      fs.writeFileSync(cachePath, JSON.stringify(value, null, 2), 'utf-8');
    }

    return true;
  } catch (error) {
    return false;
  }
};