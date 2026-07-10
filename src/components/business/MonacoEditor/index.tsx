import { LegacyRef, forwardRef, memo, useImperativeHandle, useMemo, useRef } from 'react';

import Editor, { EditorProps, OnMount, loader } from '@monaco-editor/react';
import { useMemoizedFn } from 'ahooks';
import { isArray, isNumber, isString } from 'lodash';

import { useGlobal, useSystemConfig } from '@/store';

import createDependencyProposals from './dependencyProposals';

import { EditorWrap } from './style';

const fileUrl = `${window?.resourceBaseUrl || ''}/monaco-editor/vs`;

loader.config({
  paths: { vs: fileUrl },
  'vs/nls': {
    availableLanguages: {
      '*': '',
    },
  },
});

// add custom suggestions for code editor
loader.init().then((monaco) => {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(model: any, position: any) {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const match = textUntilPosition.match(
        /"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/
      );
      if (match) {
        return { suggestions: [] };
      }
      const word = model.getWordUntilPosition(position);

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: createDependencyProposals(monaco, range),
      };
    },
  });
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: true,
    comments: 'ignore',
    trailingCommas: 'warning',
  });
  monaco.languages.html.registerHTMLLanguageService('xml', {}, { documentFormattingEdits: true });
});

export type Props = Pick<EditorProps, 'height' | 'language' | 'options'> & {
  className?: string;
  theme?: string;
  readOnly?: boolean;
  onMountAutoFormat?: boolean;
  showFullScreenBtn?: boolean;
  value: string;
  onChange?: (newVal: string) => void;
};

type MonacoEditorRef =
  | LegacyRef<HTMLDivElement>
  | {
    formatEditor: () => Promise<void>;
  };

const MonacoEditor = forwardRef<MonacoEditorRef, Props>((props, refWrapper) => {
  const {
    className,
    language = 'text',
    height = '100%',
    readOnly = false,
    options,
    onMountAutoFormat = true,
    value,
    onChange,
  } = props;

  const { font_size, font_family } = useSystemConfig((state) => state.systemConfig);
  const vscodeTheme = useGlobal(store => store.vscodeTheme);

  const editorInstanceRef = useRef<Parameters<OnMount>[0] | null>(null);

  // editor theme
  const computedTheme = useMemo(() => {
    if (vscodeTheme.includes('Light') || vscodeTheme.includes('Lighter') || vscodeTheme.includes('PowerShell ISE')) {
      return 'vs';
    } else {
      return 'vs-dark';
    }
  }, [vscodeTheme]);

  // editor font size
  const computedFontSize = useMemo(() => {
    if (isNumber(font_size)) {
      return font_size;
    }
    return 14;
  }, [font_size]);

  // editor font
  const computedFontFamily = useMemo(() => {
    if (isString(font_family)) {
      return font_family;
    }
    return '';
  }, [font_family]);

  // value
  const editorValue = useMemo(
    () => (typeof value === 'string' ? value : (value as unknown)?.toString()),
    [value]
  );

  useImperativeHandle(refWrapper, () => ({
    formatEditor,
    insertText
  }));

  const insertText = (text: string) => {
    const position = editorInstanceRef?.current?.getPosition();
    editorInstanceRef?.current?.executeEdits('insertText', [
      {
        range: {
          startLineNumber: position?.lineNumber || 1,
          startColumn: position?.column || 1,
          endLineNumber: position?.lineNumber || 1,
          endColumn: position?.column || 1,
        },
        text,
      },
    ]);
  };

  const editorOnMount: EditorProps['onMount'] = (editorInstance) => {
    // auto format code on mount
    onMountAutoFormat && editorInstance.trigger('anyString', 'editor.action.formatDocument', '');

    editorInstanceRef.current = editorInstance;
  };

  const formatEditor = useMemoizedFn(async () => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current || {};
      await editor?.getAction('editor.action.formatDocument')?.run();
      const value = editor.getValue();
      onChange && onChange(value);
    }
  });

  const handleChange: EditorProps['onChange'] = useMemoizedFn((val, changeObj) => {
    if (
      !isArray(changeObj?.changes) ||
      changeObj.changes.length <= 0 ||
      !changeObj.changes[0]?.forceMoveMarkers
    ) {
      if (onChange) {
        onChange(val);
      }
    }
  });


  return (
    <EditorWrap className="monaco-wrapper">
      <div
        className={className}
        ref={refWrapper as LegacyRef<HTMLDivElement>}
        style={{ height, overflow: 'hidden' }}
      >
        <Editor
          className="dark"
          height={height}
          language={language}
          value={editorValue}
          onMount={editorOnMount}
          onChange={handleChange}
          theme={computedTheme}
          options={{
            readOnly,
            links: false,
            wordWrap: 'on',
            wrappingIndent: 'same',
            fontSize: computedFontSize,
            fontFamily: computedFontFamily,
            automaticLayout: true,
            hover: { enabled: false },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            scrollbar: {
              useShadows: false,
              alwaysConsumeMouseWheel: false,
              arrowSize: 0,
              verticalScrollbarSize: 8,
            },
            ...options,
          }}
        />
      </div>
    </EditorWrap>
  );
});

const PureMonacoEditor = memo(MonacoEditor);

export default PureMonacoEditor;
