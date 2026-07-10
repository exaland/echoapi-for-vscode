export const FONT_SIZES: Record<number, number> = {
  90: 12,
  100: 12,
  110: 14,
  120: 16,
};

export const EDITOR_OPTIONS = {
  scrollbar: {
    useShadows: false,
    alwaysConsumeMouseWheel: false,
    arrowSize: 0,
  },
  hover: {
    enabled: false,
  },
  onemptied: () => null,
  minimap: { enabled: false },
  links: false,
  wrappingIndent: 'same',
  automaticLayout: true,
  autoIndent: true,
  formatOnPaste: true,
  formatOnType: true,
};
