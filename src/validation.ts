import path from 'path'
import fs from 'fs/promises'
import { specificationSchema } from './schemas'

export async function validateSchema(dir: string): Promise<void> {
  // specification.json
  try {
    const spec = JSON.parse(
      await fs.readFile(path.join(dir, 'specification.json'), 'utf8')
    )
    specificationSchema.parse(spec)
  } catch (err: unknown) {
    throw new Error(
      `Failed to validate catalog + node specification schema. Reason: ${(err as Error).message}`
    )
  }
  // bundle.js
  try {
    // we need to force a relative path
    const catalogBundle = await import(
      dir.startsWith('/')
        ? path.join(dir, 'bundle.js')
        : `.${path.sep}${path.join(dir, 'bundle.js')}`
    )

    const catalog = catalogBundle.Catalog

    if (typeof catalog !== 'function') {
      throw new Error(
        `bundle.js does default export is not a catalog constructor`
      )
    }
  } catch (err: unknown) {
    throw new Error(
      `Failed to validate catalog Javascript bundle. Reason: ${(err as Error).message}`
    )
  }
}
