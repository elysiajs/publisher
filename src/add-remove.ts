import packages from './packages'
import { join } from 'path'
import { copyFile, stat, rm } from 'fs/promises'

const prototype = packages.filter(x => x.endsWith('bearer'))[0]

const toCopies = ['tsconfig.dts.json', 'build.ts', '.prettierrc']
let ops = <Promise<void>[]>[]

for (const pkg of packages.filter(x => !x.endsWith('bearer'))) {
	ops.push(
		(async () => {
			const ops = <Promise<void>[]>[]
			for (const file of toCopies)
				ops.push(copyFile(join(prototype, file), join(pkg, file)))

			await Promise.all(ops)
		})()
	)
}

const toRemove = ['tsconfig.cjs.json', 'tsconfig.esm.json', 'pnpm-lock.yaml']
ops = <Promise<void>[]>[]

for (const pkg of packages.filter(x => !x.endsWith('bearer'))) {
	ops.push(
		(async () => {
			const ops = <Promise<void>[]>[]
			for (const file of toRemove) {
				const target = join(pkg, file)

				if(await stat(target).catch(() => null))
					ops.push(rm(target))
			}

			await Promise.all(ops)
		})()
	)
}
