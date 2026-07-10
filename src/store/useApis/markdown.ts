import { create } from '@/store/utils';

type State = {
  open: boolean;
  markdownRef: any;
};

type Action = {
  updateOpen: (open: State['open']) => void;
  updateMarkdownRef: (markdownRef: State['markdownRef']) => void;
};

const useApisMarkdown = create<State & Action>()((set) => ({
  open: false,
  markdownRef: null,
  updateOpen: (open: boolean) => set(() => ({ open })),
  updateMarkdownRef: (markdownRef: any) => set(() => ({ markdownRef })),
}));

export default useApisMarkdown;
