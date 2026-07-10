import { visit } from 'unist-util-visit';

const NEWLINE = '\n';

const types = {
  highlight: {
    ifmClass: 'secondary',
    keyword: 'highlight',
  },
};

// default options for plugin
const defaultOptions = {
  useDefaultTypes: true,
  infima: true,
  tag: ':::',
  icons: 'svg',
};

// override default options
const configure = (options: any) => {
  const { ...baseOptions } = {
    ...defaultOptions,
    ...options,
  };

  return {
    ...baseOptions,
    types: { ...types },
  };
};

// escape regex special characters
function escapeRegExp(s: any) {
  return s.replace(new RegExp('[-[\\]{}()*+?.\\\\^$|/]', 'g'), '\\$&');
}

// create a node that will compile to HTML
const element = (tagName: any, classes: any = [], children: any = []) => {
  return {
    type: 'lightBlock',
    data: {
      hName: tagName,
      hProperties: classes.length
        ? {
            className: classes,
          }
        : {},
    },
    children,
  };
};

export default function attacher(this: any, options: any) {
  const config = configure(options);

  // match to determine if the line is an opening tag
  const keywords = Object.keys(config.types).map(escapeRegExp).join('|');
  const tag = escapeRegExp(config.tag);
  const regex = new RegExp(`${tag}(${keywords})(?: *(.*))?\n`);
  const escapeTag = new RegExp(escapeRegExp(`\\${config.tag}`), 'g');

  // the tokenizer is called on blocks to determine if there is an admonition present and create tags for it
  function blockTokenizer(this: any, eat: any, value: any, silent: any) {
    // stop if no match or match does not start at beginning of line
    const match = regex.exec(value);
    if (!match || match.index !== 0) return false;
    // if silent return the match
    if (silent) return true;

    const now = eat.now();
    const [opening, , title] = match;
    const food = [];
    const content = [];

    // consume lines until a closing tag
    let idx = 0;
    while ((idx = value.indexOf(NEWLINE)) !== -1) {
      const next = value.indexOf(NEWLINE, idx + 1);
      const line = next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1);
      food.push(line);
      value = value.slice(idx + 1);
      if (line.startsWith(config.tag)) break;
      content.push(line);
    }

    const contentString = content.join(NEWLINE).replace(escapeTag, config.tag);
    const add = eat(opening + food.join(NEWLINE));

    const exit = this.enterBlock();
    const [elementColor = 'white', iconNode] = title.split(/\s+/g);
    const titleNode = element('div', ['light-block-icon'], [{ type: 'text', value: iconNode }]);
    const contentNodes = element(
      'div',
      ['light-block-content'],
      this.tokenizeBlock(contentString, now)
    );
    exit();

    const admonition = element(
      'div',
      ['light-block', `light-block-${elementColor}`],
      iconNode !== undefined ? [titleNode, contentNodes] : [contentNodes]
    );

    return add(admonition);
  }

  const Parser = this.Parser.prototype;
  Parser.blockTokenizers.lightBlock = blockTokenizer;
  Parser.blockMethods.splice(Parser.blockMethods.indexOf('fencedCode') + 1, 0, 'lightBlock');
  Parser.interruptParagraph.splice(Parser.interruptParagraph.indexOf('fencedCode') + 1, 0, [
    'lightBlock',
  ]);
  Parser.interruptList.splice(Parser.interruptList.indexOf('fencedCode') + 1, 0, ['lightBlock']);
  Parser.interruptBlockquote.splice(Parser.interruptBlockquote.indexOf('fencedCode') + 1, 0, [
    'lightBlock',
  ]);

  return function transformer(tree: any) {
    visit(
      tree,
      (node) => {
        return node.type !== 'lightBlock';
      },
      function visitor(node) {
        if (node.value) node.value = node.value.replace(escapeTag, config.tag);
        return node;
      }
    );
  };
}
