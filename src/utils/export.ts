import {
  PostmanToApipost,
  SwaggerToApipost,
  ThunderToApipost,
  ApipostToPostman,
  ApiToSwagger
} from 'echoapi-converter';
import { ApiDetailsData } from '@/types/apis/api';
import { validate } from 'jsonschema';
import schemaRule2 from './postmanSchema/postman_schema2.0';
import schemaRule2_1 from './postmanSchema/postman_schema2.1';

export const throwResult = (status: 'error' | 'success', message: string, data: any = '') => {
  return {
    status,
    message,
    data,
  };
};

const ApiToSwaggerClass = new ApiToSwagger();

const PostmanToApipostClass = new PostmanToApipost();
const SwaggerToApipostClass = new SwaggerToApipost();
const ThunderToApipostClass = new ThunderToApipost();
const ApipostToPostmanClass = new ApipostToPostman();
export const exportMethod = {
  apiToSwagger: async (data: any, version: string, language?: 'en' | 'zh-cn' | 'ja' | 'zh-hant' | 'id') => {
    try {
      return await ApiToSwaggerClass.apiToswagger(data, version as '2.0' | '3.0', language);
    } catch (err) {
      return throwResult('error', String(err));
    }
  },
  apiToPostman: async (data: any) => {
    try {
      return await ApipostToPostmanClass.convert(data);
    } catch (err) {
      return throwResult('error', String(err));
    }
  },
};

export const importMethod = {
  postmanToApipost: async (data: any, project_id: string) => {
    try {
      let valid_2 = validate(data, schemaRule2).valid;
      let valid_2_1 = validate(data, schemaRule2_1).valid;
      if (!valid_2 && !valid_2_1) {
        return throwResult('error', 'Import Failed: Unsupported file format. Please upload a vaild Postman file or a compatible format');
      }
      return await PostmanToApipostClass.convert(data, project_id, { source: 'vscode' });
    } catch (err) {
      return throwResult('error', String(err));
    }
  },
  thunderToApipost: (data: any, project_id: string) => {
    try {
      return ThunderToApipostClass.convert(data, project_id);
    } catch (err) {
      return throwResult('error', String(err));
    }
  },
  swaggerToApipost: async (data: any, options: { basePath: boolean; host: boolean } | null) => {
    try {
      return await SwaggerToApipostClass.convert(data, options);
    } catch (err) {
      return throwResult('error', String(err));
    }
  },
};
