let m: any;

function mermaid({ ...mermaidConfig } = {}) {
  return {
    viewerEffect({ markdownBody }: any) {
      (async () => {
        const els = markdownBody.querySelectorAll('pre>code.language-mermaid');
        if (els.length === 0) return;
        if (!m) {
          m = await import('mermaid').then((c) => c.default);
          if (mermaidConfig) {
            m.initialize(mermaidConfig);
          }
        }
        els.forEach((el: any, i: number) => {
          const pre = el.parentElement!;
          const source = el.innerText;

          const container = document.createElement('div');
          container.classList.add('bytemd-mermaid');
          container.style.lineHeight = 'initial'; // reset line-height
          pre.replaceWith(container);

          m.render(`bytemd-mermaid-${Date.now()}-${i}`, source, container)
            .then((svgCode: any) => {
              container.innerHTML = svgCode.svg;
            })
            .catch(() => {});
        });
      })();
    },
  };
}
export { mermaid as default };
