import { access, readFile } from 'node:fs/promises'

const required = [
  'lib/index.js',
  'lib/client.js',
  'assets/mascot.png',
  'cordis.patch.yml',
  'README.md',
  'LICENSE',
  'NOTICE',
]

await Promise.all(required.map((file) => access(file)))

const [pkgText, client, asset] = await Promise.all([
  readFile('package.json', 'utf8'),
  readFile('lib/client.js', 'utf8'),
  readFile('assets/mascot.png'),
])
const pkg = JSON.parse(pkgText)

if (pkg.dsh?.client?.platform !== 'web') throw new Error('Missing dsh.client web manifest')
if (!client.includes('window.__ModuleLoader__.load')) throw new Error('Client handoff wrapper is missing')
if (!client.includes('data:image/png;base64,')) throw new Error('Mascot was not embedded in the client bundle')
if (!client.includes('setPointerCapture')) throw new Error('Mascot drag support is missing')
if (!client.includes('dsh-deepwhale-minimal-theme:mascot-position')) throw new Error('Mascot position persistence is missing')
if (client.includes('radial-gradient(circle, var(--deepwhale-glow)')) throw new Error('Removed mascot glow is still bundled')
if (client.includes('drop-shadow(')) throw new Error('Removed mascot shadow is still bundled')
if (asset.length < 10_000) throw new Error('Mascot asset is unexpectedly small')

console.log('Package verification passed.')
