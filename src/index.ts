declare global {
    interface PackageJSON {
        name: string
        version: string
        dependencies: Record<string, string>
        devDependencies: Record<string, string>
        peerDependencies: Record<string, string> & {
            elysia: string
        }
    }
}
