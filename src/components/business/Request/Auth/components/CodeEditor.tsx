import MonacoEditor from '@/components/business/MonacoEditor';

import { CodeContainer } from '../style';

const CodeEditor = (props: any) => {
  return (
    <CodeContainer>
      <MonacoEditor
        language="json"
        height="100%"
        value={props?.value || ''}
        onChange={props?.onChange}
      />
    </CodeContainer>
  );
};

export default CodeEditor;
