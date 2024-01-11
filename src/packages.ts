import { join } from 'path'

export const names = [
    'apollo',
    'bearer',
    'cookie',
    'cors',
    'cron',
    'eden',
    // 'fn',
    'graphql-yoga',
    'html',
    'jwt',
    // 'lucia-auth',
    'server-timing',
    'static',
    'stream',
    'swagger',
    'trpc'
] as const

const packages = await Promise.all(
    names.map(async (name) => {
        const loc = join(import.meta.dir, '../..', name)
        const packageJson = join(loc, 'package.json')

        if (!(await Bun.file(packageJson).exists())) {
            throw new Error(`${packageJson} doesn't existed`)
            process.exit(1)
        }

        return loc
    })
)

export default packages
