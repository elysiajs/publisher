import packages from './packages'
import { getVersion } from './utils'

const ops: Promise<string | void>[] = []

for (const cwd of packages)
    ops.push(
        (async () => {
            const process = Bun.spawn({
                cmd: ['bun', 'run', 'build'],
                cwd,
                stdout: null
            })

            await process.exited

            if (process.exitCode !== 0) return cwd
        })()
    )

const failed = await Promise.all(ops).then((ops) => ops.filter((x) => x))

console.clear()

if (!failed.length) {
    console.log('Passed all tests :D')
    process.exit(0)
}

console.error('Failed to test:')
failed.forEach((name) => console.error(`- ${name}`))
