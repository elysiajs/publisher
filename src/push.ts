import packages from './packages'
import { getVersion } from './utils'

const ops: Promise<string | void>[] = []

for (const cwd of packages)
    ops.push(
        (async () => {
            const add = Bun.spawn({
                cmd: ['git', 'add', '--all'],
                cwd,
                stdout: null
            })

            await add.exited

            const commit = Bun.spawn({
                cmd: ['git', 'commit', '-m', ':broom: chore: bump version'],
                cwd,
                stdout: null
            })

            await commit.exited

            const push = Bun.spawn({
                cmd: ['git', 'push'],
                cwd,
                stdout: null
            })

            await commit.exited
        })()
    )
