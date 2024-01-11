import packages from './packages'

const cmd = ['bun', 'install']
const ops: Promise<void>[] = []

for (const name of packages)
    ops.push(
        (async () => {
            Bun.spawn({
                cmd,
                cwd: name,
                stdout: 'ignore'
            })
        })()
    )
