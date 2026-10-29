import { describe, expect, it } from 'vitest';
import { self } from './index.js';
import { createMatchers } from './matchers.js';

describe('createMatchers', () => {
  it('follows the suffix', () => {
    const { isCatalogFile, isDocFile } = createMatchers('catalog');
    expect(isCatalogFile('/a/Foo.catalog.svelte')).toBe(true);
    expect(isCatalogFile('/a/Foo.self.svelte')).toBe(false);
    expect(isDocFile('/a/Foo.catalog.md')).toBe(true);
    expect(isDocFile('/a/Foo.self.md')).toBe(false);
    expect(isDocFile('/a/Document.md')).toBe(false);
  });

  it('maps a catalog file to its doc file', () => {
    const { docFileOf } = createMatchers('self');
    expect(docFileOf('/a/Foo.self.svelte')).toBe('/a/Foo.self.md');
  });

  it('is case-sensitive, using the suffix verbatim', () => {
    const { isCatalogFile } = createMatchers('self');
    expect(isCatalogFile('/a/Foo.SELF.svelte')).toBe(false);
  });

  it.each(['a.b', '', 'a b', 'a|b'])('rejects invalid suffix %j', (suffix) => {
    expect(() => createMatchers(suffix)).toThrow(/suffix/);
    expect(() => self({ suffix })).toThrow(/suffix/);
  });
});
