import packages from './packages'
import { access } from 'fs/promises'
import { join } from 'path'
import { rimraf } from 'rimraf'

const ops = <Promise<any>[]>[]
for (const name of packages) {
    ops.push(
        (async () => {
            await Promise.all(
                ['node_modules', 'bun.lockb'].map(async (file) => {
                    const path = join(name, file)

                    if (
                        await access(path)
                            .then(() => true)
                            .catch(() => false)
                    )
                        await rimraf(join(name, path))
                })
            )

            Bun.$.cwd(name)
            await Bun.$`bun install`
        })()
    )
}

await Promise.all(ops)
