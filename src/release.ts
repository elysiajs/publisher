import { writeFile } from 'fs/promises'
import dayjs from 'dayjs'

import packages, { names } from './packages'
import { ask, getVersion } from './utils'

// @ts-ignore
const filters = ['lucia-auth', 'eden', 'fn'] satisfies (typeof names)[number][]

const [, , ...rest] = Bun.argv

const appendChangeLog = async (location: string) => {
    const file = Bun.file(`${location}/CHANGELOG.md`)
    if (!(await file.exists())) {
        console.log(`${location} not existed`)
        return process.exit(1)
    }

    const version = await Bun.file(`${location}/package.json`)
        .json<PackageJSON>()
        .then((x) => x.version)

    const [major, minor] = version.split('.')
    const content = await file.text()

    if (content.includes(`# ${version} -`)) return

    const changed = `
# ${version} - ${dayjs().format('D MMM YYYY')}
Change:
- Add support for Elysia ${major}.${minor}`

    await writeFile(`${location}/CHANGELOG.md`, `${changed}\n\n${content}`)
}

let ops: Promise<string | void>[] = []
let passed: string[] = []
let failed: string[] = []

for (const cwd of packages.filter(
    (name) => !filters.includes(name.split('/').at(-1) as any)
))
    ops.push(
        (async () => {
            const process = Bun.spawn({
                cmd: ['bun', 'run', 'test'],
                cwd,
                stdout: null
            })

            await process.exited

            if (process.exitCode === 0) passed.push(cwd)
            else failed.push(cwd)
        })()
    )

console.clear()

await Promise.all(ops)

if (failed.length) {
    console.error('Failed to test:')
    failed.forEach((name) => console.error(`- ${name}`))
    console.log('')
}

const toPublish = [...passed]
ops = []
passed = []
failed = []

const release = ['bun', 'run', 'release', ...rest]

const metas: PackageJSON[] = await Promise.all(
    toPublish.map((name) => Bun.file(`${name}/package.json`).json())
)

console.log('You are about to publish to following package')
metas.forEach(({ name, version }) => console.log(`- ${name}@${version}`))
console.log(`\n$ ${release.join(' ')}`)

const answer = await ask('Are you sure (Y/n)')
if (answer.toLowerCase() === 'n') process.exit(0)

for (const cwd of toPublish)
    ops.push(
        (async () => {
            await appendChangeLog(cwd)

            const process = Bun.spawn({
                cmd: release,
                cwd,
                stdout: null
            })

            await process.exited

            if (process.exitCode === 0) passed.push(cwd)
            else failed.push(cwd)
        })()
    )

await Promise.all(ops)

if (failed.length) {
    console.error('Failed to publish:')
    failed.forEach((name) => console.error(`- ${name}`))
}

if (passed.length) {
    console.log('Published')
    passed.forEach((name) => console.log(`- ${name}`))
}

process.exit(0)
