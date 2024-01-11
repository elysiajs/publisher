import packages from './packages'
import { getVersion } from './utils'

const version = getVersion()
const cmd = ['bun', 'add', '-d', `elysia@${version}`]
const ops: Promise<void>[] = []

for (const name of packages)
    ops.push(
        (async () => {
            const packageJson: PackageJSON = await Bun.file(
                `${name}/package.json`
            ).json()

            if (packageJson.devDependencies.elysia === version) return

            await Bun.spawn({
                cmd,
                cwd: name,
                stdout: 'ignore'
            })
        })()
    )
