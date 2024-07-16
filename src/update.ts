import { writeFile } from 'fs/promises'
import packages from './packages'
import { getVersion } from './utils'

const version = getVersion()

const ops: Promise<void>[] = []

for (const name of packages)
    ops.push(
        (async () => {
            const packageJson: PackageJSON = await Bun.file(
                `${name}/package.json`
            ).json()

            await writeFile(
                `${name}/package.json`,
                JSON.stringify(
                    {
                        ...packageJson,
                        devDependencies: {
                        	...packageJson.devDependencies,
                         	elysia: version
                        }
                    } satisfies PackageJSON,
                    null,
                    4
                )
            )

            Bun.$.cwd(name)
            await Bun.$`rm -rf node_modules && rm bun.lockb && bun add -d elysia@${version}`
        })()
    )

await Promise.all(ops)
