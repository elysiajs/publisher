import { writeFile } from 'fs/promises'

import packages from './packages'
import { getVersion } from './utils'

const version = getVersion()
const cmd = ['bun', 'add', '-d', `elysia@${version}`]
const ops: Promise<void>[] = []

for (const name of packages)
    ops.push(
        (async () => {
            const fileName = `${name}/package.json`

            const packageJson: PackageJSON = await Bun.file(fileName).json()
            if (packageJson.version === version) return

            await writeFile(
                fileName,
                JSON.stringify(
                    {
                        ...packageJson,
                        version
                    },
                    null,
                    4
                )
            )
        })()
    )
