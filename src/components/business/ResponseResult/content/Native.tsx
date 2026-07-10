import MonacoEditor from '@/components/business/MonacoEditor';

interface Props {
  rawHtml?: string;
}
const Native = (props: Props) => {
  const { rawHtml } = props || {};

  return (
    <MonacoEditor
      language="text"
      readOnly
      value={rawHtml || ''}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lineNumbers="off"
    />
  );
};

export default Native;
