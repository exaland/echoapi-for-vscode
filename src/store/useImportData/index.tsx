import { create } from '@/store/utils';
import { ApiDetailsData } from '@/types/apis/api';
import { EnvList } from '@/types/envManage';
import { IDataModel } from '@/types/schemas';

type State = {
  previewData: {
    apis: ApiDetailsData[];
    models: IDataModel[];
    envs: EnvList;
  };
  previewSelectData:{
    apis: string[];
    models: string[];
    envs: string[];
    apiHalfs?: string[];
    modelHalfs?: string[];
  };
  preview:boolean;
  previewLoading:boolean;
};

type Action = {
  updatePreviewData: (previewData: State['previewData']) => void;
  updatePreviewSelectData: (previewSelectData: State['previewSelectData']) => void;
 
  updatePreview: (preview: State['preview']) => void;
  updatePreviewLoading: (previewLoading: State['previewLoading']) => void;

};

const useImportData = create<State & Action>()((set) => ({
  previewData: {
    apis: [],
    models: [],
    envs: [],
  },
  previewSelectData:{
    apis: [],
    models: [],
    envs: [],
  },
  preview:false,
  previewLoading:false,

  updatePreviewData: (previewData) => set(() => ({ previewData })),
  updatePreviewSelectData: (previewSelectData) => set(() => ({ previewSelectData })),
  updatePreview: (preview) => set(() => ({ preview })),
  updatePreviewLoading: (previewLoading) => set(() => ({ previewLoading })),
  
}));

export default useImportData;
