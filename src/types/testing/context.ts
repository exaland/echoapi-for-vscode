export type TestingDataContext<T> = {
  testingData: T;
  onTestingDataChange: (testingData: T) => void;
};
