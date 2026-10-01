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
if (asset.length < 10_000) throw new Error('Mascot asset is unexpectedly small')

console.log('Package verification passed.')
