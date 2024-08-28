import path from 'path'
import fs from 'fs/promises'
import { catalogSchema, specificationSchema } from './schemas'

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
    // we need to force a relative path and bypass the dynamic import removal by webpack
    const f = new Function('p', 'return import(p)')
    const catalogBundle = await f(
      dir.startsWith('/')
        ? path.join(dir, 'bundle.js')
        : `.${path.sep}${path.join(dir, 'bundle.js')}`
    )

    const catalog =
      catalogBundle['default']['default'] ?? catalogBundle['default']

    catalogSchema.parse(catalog)
  } catch (err: unknown) {
    throw new Error(
      `Failed to validate catalog Javascript bundle. Reason: ${(err as Error).message}`
    )
  }
}
