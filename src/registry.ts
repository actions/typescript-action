export async function updateRegistry(
  getRegistry: () => Promise<string | undefined>,
  setRegistry: (data: string) => Promise<void>,
  defaultRegistry: Omit<Registry, 'versions'>,
  catalog: CatalogVersion
): Promise<void> {
  try {
    const body = await getRegistry()

    const registry: Registry = body
      ? JSON.parse(body)
      : {
          ...defaultRegistry,
          versions: []
        }

    if (Array.isArray(registry.versions)) {
      const duplicateIndex = registry.versions.findIndex(
        c => c.url === catalog.url && c.version === catalog.version
      )
      if (duplicateIndex === -1) {
        registry.versions.push(catalog)
      } else {
        registry.versions[duplicateIndex] = catalog
      }
    } else {
      registry.versions = [catalog]
    }

    await setRegistry(JSON.stringify(registry))
  } catch (err: unknown) {
    throw new Error(
      `Unable to update registry. Cause: ${(err as Error).message}`
    )
  }
}

type Registry = {
  name: string
  description: string
  logo: string
  versions: CatalogVersion[]
}

export type CatalogVersion = {
  version: string
  url: string
  changelog: string[]
  dev: boolean
  minimumEngineVersion?: string
}
