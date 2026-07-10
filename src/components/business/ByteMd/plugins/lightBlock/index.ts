import remarkParse from 'remark-parse';

import remarkHightBlock from './parser';

const LightBlock = () => {
  return {
    remark: (processor: any) => {
      return processor.use(remarkParse).use(remarkHightBlock);
    },
    viewerEffect() {},
  };
};

export default LightBlock;
