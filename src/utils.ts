import { createInterface } from 'readline'

const semver =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

const [, , version] = Bun.argv

const readline = require('readline')

export const ask = (query: string) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise<string>((resolve) =>
        rl.question(query, (ans: string) => {
            rl.close()
            resolve(ans)
        })
    )
}

export const getVersion = () => {
    if (!version || !semver.test(version)) {
        console.log('Invalid version:', version)
        process.exit(1)
    }

    return version
}

export { version }

export const validateElysiaVersion = () => {
    if (!version || !semver.test(version)) {
        console.log('Invalid version:', version)
        process.exit(1)
    }

    const ops: Promise<void>[] = []
    const cmd = ['bun', 'add', '-d', `elysia@${version}`]

    if (
        Bun.spawnSync({
            cmd
        }).exitCode !== 0
    ) {
        console.error('Invalid Elysia version')
        process.exit(1)
    }
}
