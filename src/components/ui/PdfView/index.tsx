import React, { useState } from 'react';
import PDF from 'react-pdf-js';

import { useMount } from 'ahooks';
import { isNull, isNumber } from 'lodash';

type Props = {
  file: any;
};

const PdfView: React.FC<Props> = (props) => {
  const { file } = props;

  const [pdfjsWorker, setPdfjsWorker] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const onDocumentComplete = (pages: number) => {
    setNumPages(pages);
  };
  function directlyRenderPdf(num: number) {
    const x = [];
    for (let i = 2; i <= num; i++) {
      x.push(<PDF workerSrc={pdfjsWorker || ''} page={i} key={`x${i}`} file={file} scale={0.61} />);
    }
    return x;
  }

  useMount(() => {
    import('pdfjs-dist/build/pdf.worker.entry').then((src) => {
      setPdfjsWorker(src);
    });
  });

  return (
    <>
      {!isNull(pdfjsWorker) && (
        <>
          <PDF
            workerSrc={pdfjsWorker}
            scale={0.61}
            onDocumentComplete={onDocumentComplete}
            page={1}
            file={file}
          />
          {isNumber(numPages) && numPages > 1 && directlyRenderPdf(numPages)}
        </>
      )}
    </>
  );
};

export default PdfView;
