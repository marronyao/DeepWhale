import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const input = resolve('assets/mascot.png')
const output = resolve('src/mascot.generated.ts')
const png = await readFile(input)
const source = `// Generated file. Do not edit by hand.\nexport const mascotDataUrl = ${JSON.stringify(`data:image/png;base64,${png.toString('base64')}`)}\n`
await writeFile(output, source, 'utf8')
