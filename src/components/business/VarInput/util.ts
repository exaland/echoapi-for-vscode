export function getElementTextOffset(element: HTMLElement, index: number) {
  const textHtml = element.innerText.substr(0, index);
  const elementStyle = window.getComputedStyle(element);
  const sourceOffset = element.getBoundingClientRect();

  // Apply input box styles to the span element
  const cloneDom = document.createElement('div');
  cloneDom.style.width = elementStyle.width;
  cloneDom.style.font = elementStyle.font;
  cloneDom.style.position = 'fixed';
  cloneDom.innerHTML = `<span>${textHtml.replace(/\n/g, '<br />')}</span><span>.</span>`;
  element && element.parentNode && element.parentNode.appendChild(cloneDom);

  const cloneDomOffset = cloneDom.getBoundingClientRect();

  // Cursor position
  const AnchorOffset = cloneDom?.children?.[1]?.getBoundingClientRect();

  const result = {
    left: AnchorOffset.left,
    top: sourceOffset.top + cloneDomOffset.height + 5,
  };
  cloneDom.remove();

  return result;
}
