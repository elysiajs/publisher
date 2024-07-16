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
            if (packageJson.peerDependencies?.elysia === peerVersion) return

            await writeFile(
                fileName,
                JSON.stringify(
                    {
                        ...packageJson,
                        peerDependencies: {
                            elysia: peerVersion
                        }
                    } satisfies PackageJSON,
                    null,
                    4
                )
            )
        })()
    )

await Promise.all(ops)
