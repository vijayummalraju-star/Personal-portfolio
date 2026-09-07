/**
 * Vite plugin that adds data-source-loc="file:line:col" attributes to every
 * JSX element at compile time. This enables the element picker to map rendered
 * DOM nodes back to their source file and line number.
 */
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import * as t from '@babel/types';
const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;
export function sourceTags() {
  let projectRoot = '';
  return { name: 'vite-source-tags', enforce: 'pre', configResolved(config) { projectRoot = config.root; }, transform(code, id) {
    if (!/\.[jt]sx$/.test(id) || id.includes('node_modules')) return null;
    let ast;
    try { ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] }); } catch { return null; }
    let modified = false;
    traverse(ast, { JSXOpeningElement(path) {
      const node = path.node;
      if (t.isJSXIdentifier(node.name) && node.name.name === 'Fragment') return;
      if (t.isJSXMemberExpression(node.name) && t.isJSXIdentifier(node.name.property) && node.name.property.name === 'Fragment') return;
      if (!node.name.name && t.isJSXNamespacedName(node.name)) return;
      const loc = node.loc; if (!loc) return;
      if (node.attributes.some(attr => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'data-source-loc')) return;
      const relPath = id.startsWith(projectRoot) ? id.slice(projectRoot.length + 1) : id;
      const value = `${relPath}:${loc.start.line}:${loc.start.column}`;
      node.attributes.push(t.jsxAttribute(t.jsxIdentifier('data-source-loc'), t.stringLiteral(value)));
      modified = true;
    }});
    if (!modified) return null;
    const output = generate(ast, { retainLines: true }, code);
    return { code: output.code, map: output.map };
  }};
}
export const agonSourceTags = sourceTags;
