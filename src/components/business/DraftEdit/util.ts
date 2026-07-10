/* eslint-disable no-useless-escape */
import { CompositeDecorator } from 'draft-js';

import EnvTag from './envTag';
import ErrorTag from './errorTag';
import SystemTag from './systemTag';

// regex match
export function findWithRegex(regex: any, contentBlock: any, callback: any) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

// match regular environment variables not starting with $ or !
const ENV_REGEX = /\{\{(?![\$!])[^\{\}]+\}\}/g;
// match global variables starting with $
const GLOBAL_REGEX = /\{\{\$[^\{\}]+\}\}/g;
// match error tags starting with !
const UNKNOWN_REGEX = /\{\{![^\{\}]+\}\}/g;

function handleMatchEnv(contentBlock: any, callback: any) {
  findWithRegex(ENV_REGEX, contentBlock, callback);
}
function handleMatchGlobal(contentBlock: any, callback: any) {
  findWithRegex(GLOBAL_REGEX, contentBlock, callback);
}

function handleMatchError(contentBlock: any, callback: any) {
  findWithRegex(UNKNOWN_REGEX, contentBlock, callback);
}

export const compositeDecorator = new CompositeDecorator([
  {
    strategy: handleMatchEnv,
    component: EnvTag,
  },
  {
    strategy: handleMatchGlobal,
    component: SystemTag,
  },
  {
    strategy: handleMatchError,
    component: ErrorTag,
  },
]);

export default { findWithRegex, compositeDecorator };
