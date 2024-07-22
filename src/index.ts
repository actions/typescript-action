import * as core from '@actions/core'
import fs from 'fs/promises'
import { validateSchema } from './validation'
import { updateRegistry } from './registry'
import { S3 } from '@aws-sdk/client-s3'
import { deleteCatalog, uploadCatalog } from './catalog'
import { joinPath } from './util'

const inputs = {
  token: 'token',
  endpoint: 'endpoint',
  region: 'region',
  bucket: 'bucket',
  accessKeyId: 'access_key_id',
  secretAccessKey: 'secret_access_key',
  destDir: 'dest_dir',
  sourceDir: 'source_dir',
  name: 'name',
  description: 'description',
  logo: 'logo',
  server: 'server',
  orgName: 'org_name',
  spaceName: 'space_name',
  version: 'version',
  url: 'url',
  changelog: 'changelog',
  dev: 'dev',
  onFail: 'on_fail'
} as const

async function main(): Promise<void> {
  try {
    const srcDir = core.getInput(inputs.sourceDir, { required: true })

    await validateSchema(srcDir)

    const token = core.getInput(inputs.token, { required: true })
    const endpoint = core.getInput(inputs.endpoint, { required: true })
    const bucket = core.getInput(inputs.bucket, { required: true })
    const region = core.getInput(inputs.region, { required: true })
    const accessKeyId = core.getInput(inputs.accessKeyId, { required: true })
    const secretAccessKey = core.getInput(inputs.secretAccessKey, {
      required: true
    })
    const name = core.getInput(inputs.name, { required: true })
    const description = core.getInput(inputs.description, { required: true })
    const logo = core.getInput(inputs.logo, { required: true })
    const destDir = core.getInput(inputs.destDir, { required: true })
    const server = core.getInput(inputs.server, { required: true })
    const orgName = core.getInput(inputs.orgName, { required: true })
    const spaceName = core.getInput(inputs.spaceName, { required: true })
    const version = core.getInput(inputs.version, { required: true })
    const url = core.getInput(inputs.url, { required: true })
    const changelog = core.getMultilineInput(inputs.changelog, {
      required: true
    })
    const dev = core.getBooleanInput(inputs.dev, { required: false }) ?? false
    const onFail = core.getInput(inputs.onFail, { required: false })

    const s3 = new S3([
      {
        endpoint,
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      }
    ])

    const catalog = {
      version,
      url,
      changelog,
      dev
    }

    try {
      await writeFileTo(
        s3,
        bucket,
        joinPath(destDir, 'specification.json')
      )(joinPath(srcDir, 'specification.json'))
      await writeFileTo(
        s3,
        bucket,
        joinPath(destDir, 'bundle.js')
      )(joinPath(srcDir, 'bundle.js'))

      const catalogId = await uploadCatalog(
        server,
        token,
        orgName,
        spaceName,
        catalog
      )

      try {
        await updateRegistry(
          readFrom(s3, bucket, joinPath(destDir, 'index.json')),
          writeTo(s3, bucket, joinPath(destDir, 'index.json')),
          { name, description, logo },
          catalog
        )
      } catch (err) {
        await deleteCatalog(server, token, orgName, spaceName, catalogId)
        throw err
      }
    } catch (err) {
      if (onFail === 'delete') {
        await s3.deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: [
              {
                Key: joinPath(destDir, 'bundle.js')
              },
              {
                Key: joinPath(destDir, 'specification.json')
              }
            ]
          }
        })
      }
    } finally {
      s3.destroy()
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

function writeTo(
  s3: S3,
  bucket: string,
  location: string
): (data: Parameters<S3['putObject']>[0]['Body']) => Promise<void> {
  return async function (data) {
    await s3.putObject({ Bucket: bucket, Key: location, Body: data })
  }
}
function writeFileTo(
  s3: S3,
  bucket: string,
  location: string
): (path: string) => Promise<void> {
  const fn = writeTo(s3, bucket, location)
  return async function (path: string) {
    await fn(await fs.readFile(path))
  }
}
function readFrom(
  s3: S3,
  bucket: string,
  location: string
): () => Promise<string | undefined> {
  return async function () {
    const result = await s3.getObject({ Bucket: bucket, Key: location })
    return result.Body?.transformToString('utf-8')
  }
}

main()
