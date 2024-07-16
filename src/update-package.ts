import { writeFile } from 'fs/promises'

import packages from './packages'

const ops: Promise<void>[] = []

for (const name of packages)
	ops.push(
		(async () => {
			const fileName = `${name}/package.json`

			const packageJson: PackageJSON = await Bun.file(fileName).json()
			if (!packageJson) return

			await writeFile(
				fileName,
				JSON.stringify(
					{
						...packageJson,
						// "main": "./dist/cjs/index.js",
						// "module": "./dist/index.mjs",
						// "types": "./dist/index.d.ts",
						// "exports": {
						//   "./package.json": "./package.json",
						//   ".": {
						//     "types": "./dist/index.d.ts",
						//     "import": "./dist/index.mjs",
						//     "require": "./dist/cjs/index.js"
						//   }
						// },
						// "scripts": {
						// 	// @ts-ignore
						// 	...packageJson.scripts,
						//  	"build": "bun build.ts",
						// },
						devDependencies: {
							...packageJson.devDependencies,
							eslint: '9.6.0',
							'@types/bun': '1.1.6'
						}
					} satisfies PackageJSON,
					null,
					4
				)
			)
		})()
	)

await Promise.all(ops)
