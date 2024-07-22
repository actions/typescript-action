import HCloud from '@moovit-sp-gmbh/hcloud-sdk'
import { CatalogVersion } from './registry'

export async function uploadCatalog(
  server: string,
  token: string,
  orgName: string,
  spaceName: string,
  catalog: CatalogVersion
): Promise<string> {
  const hcl = new HCloud({ server })

  hcl.setAuthToken(token)

  return (
    await hcl.High5.space.wave.addUpdateSpaceWaveCatalog(
      orgName,
      spaceName,
      catalog
    )
  )._id
}

export async function deleteCatalog(
  server: string,
  token: string,
  orgName: string,
  spaceName: string,
  catalogId: string
): Promise<void> {
  const hcl = new HCloud({ server })

  hcl.setAuthToken(token)

  return hcl.High5.space.wave.deleteSpaceWaveCatalog(
    orgName,
    spaceName,
    catalogId
  )
}
