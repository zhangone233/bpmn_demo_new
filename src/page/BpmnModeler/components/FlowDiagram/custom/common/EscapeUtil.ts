// @ts-nocheck
export { default as escapeCSS } from 'css.escape';

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHTML(str) {
  str = `${ str}`;

  return (
    str &&
    str.replace(/[&<>"']/g, function (match) {
      return HTML_ESCAPE_MAP[match];
    })
  );
}
