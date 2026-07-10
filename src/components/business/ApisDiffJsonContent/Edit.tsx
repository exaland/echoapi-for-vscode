import { DiffEditor, loader } from '@monaco-editor/react';
import { isEqual } from 'lodash';

import { useSystemConfig } from '@/store';

import { VersionEditWrap } from './style';

interface Props {
  prevValue: string;
  nextValue: string;
  activeKey?: string;
  isAutoHeight?: boolean;
}
const Edit = (props: Props) => {
  const { prevValue, nextValue, activeKey, isAutoHeight } = props || {};
  const systemConfig = useSystemConfig((state) => state.systemConfig);
  const { bg_color } = systemConfig || {};
  const file_url = '/monaco-editor/vs';
  loader.config({
    paths: { vs: file_url },
    'vs/nls': {
      availableLanguages: { '*': 'en' },
    },
  });
  const handleString = (string: string) => {
    try {
      return isEqual(activeKey, 'description') ? JSON.parse(string || '') : string || '';
    } catch (error) {
      return string;
    }
  };

  return (
    <VersionEditWrap style={{ height: isAutoHeight ? 460 : 320 }}>
      <DiffEditor
        theme={['white', 'orange'].includes(bg_color) ? 'vs' : 'vs-dark'}
        options={{
          wordWrap: 'on',
          readOnly: true,
          minimap: { enabled: false },
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            verticalScrollbarSize: 10,
          },
        }}
        language="json"
        original={handleString(prevValue)}
        modified={handleString(nextValue)}
      />
    </VersionEditWrap>
  );
};

export default Edit;
