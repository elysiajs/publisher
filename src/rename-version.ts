import { writeFile } from 'fs/promises'

import packages from './packages'
import { getVersion } from './utils'

const version = getVersion()
const ops: Promise<void>[] = []

for (const name of packages)
    ops.push(
        (async () => {
            const fileName = `${name}/package.json`

            const peerVersion = `>= ${version}`

            const packageJson: PackageJSON = await Bun.file(fileName).json()
            if (packageJson.version === version) return

            await writeFile(
                fileName,
                JSON.stringify(
                    {
                        ...packageJson,
                        version
                    } satisfies PackageJSON,
                    null,
                    4
                )
            )
        })()
    )

await Promise.all(ops)
