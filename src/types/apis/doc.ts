import { ApisBaseData } from './base';

export interface DocDetailsData extends ApisBaseData {
  attribute_info: Record<string, any>;
  description: string;
}
