# publisher

Elysia local CI to locally test and publish new version concurrently by spawing a new process to enter each directory of plugin to run test, build and modify file like `package.json` / `README.md` / `CHANGELOG.md` and others.

## Structure
It's intent to place the structure in the same level of plugins as follows:

- folder
-- publisher
-- [other elysia plugins]

## Command
See `package.json` script, should be self explainary.

You can find script in the source code inside `src`, file name are named after `script`.

