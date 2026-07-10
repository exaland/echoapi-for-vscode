export interface IEnvDataItem {
  key?: string;
  // Redundant field, always a fixed value of 1
  type?: string;

  // Variable initial value
  value: string;

  // Variable current value
  current_value: string;

  // Variable description
  description?: string;

  static?: boolean;
}
