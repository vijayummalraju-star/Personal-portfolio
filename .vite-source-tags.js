// Vite source tags plugin
export function sourceTags() {
  return { name: 'vite-source-tags', enforce: 'pre' };
}
export const agonSourceTags = sourceTags;
