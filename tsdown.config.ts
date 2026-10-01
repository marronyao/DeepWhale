import { defineConfig } from 'tsdown'

const pluginId = 'dsh-deepwhale-minimal-theme'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    platform: 'node',
    outDir: 'lib',
    clean: true,
    dts: false,
    outputOptions: { entryFileNames: 'index.js' },
  },
  {
    entry: { client: 'src/client.ts' },
    format: ['cjs'],
    platform: 'browser',
    outDir: 'lib',
    clean: false,
    dts: false,
    deps: { neverBundle: ['react'] },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(pluginId)}, factory: (require) => {`,
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  },
])
