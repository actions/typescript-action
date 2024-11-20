import * as core from '@actions/core'
import fs from 'fs/promises'
import { validateSchema } from './validation'
import { updateRegistry } from './registry'
import { S3 } from '@aws-sdk/client-s3'
import { joinPath } from './util'

const inputs = {
  endpoint: 'endpoint',
  publicEndpoint: 'public_endpoint',
  region: 'region',
  bucket: 'bucket',
  accessKeyId: 'access_key_id',
  secretAccessKey: 'secret_access_key',
  destDir: 'dest_dir',
  sourceDir: 'source_dir',
  name: 'name',
  description: 'description',
  logo: 'logo',
  version: 'version',
  changelog: 'changelog',
  onFail: 'on_fail',
  minimumEngineVersion: 'minimum_engine_version'
} as const

async function main(): Promise<void> {
  try {
    const srcDir = core.getInput(inputs.sourceDir, { required: true })

    await validateSchema(srcDir)

    const endpoint = core.getInput(inputs.endpoint, { required: true })
    const publicEndpoint = core.getInput(inputs.publicEndpoint, {
      required: true
    })
    const bucket = core.getInput(inputs.bucket, { required: true })
    const region = core.getInput(inputs.region, { required: false }) ?? ''
    const accessKeyId = core.getInput(inputs.accessKeyId, { required: true })
    const secretAccessKey = core.getInput(inputs.secretAccessKey, {
      required: true
    })
    const name = core.getInput(inputs.name, { required: true })
    const description = core.getInput(inputs.description, { required: true })
    const logo = core.getInput(inputs.logo, { required: true })
    const destDir = core.getInput(inputs.destDir, { required: true })
    const version = core.getInput(inputs.version, { required: true })
    const changelog = core.getMultilineInput(inputs.changelog, {
      required: true
    })
    const dev = version.includes("dev") ? true : false;
    const minimumEngineVersion = core.getInput(inputs.minimumEngineVersion, {
      required: true
    })
    const onFail = core.getInput(inputs.onFail, { required: false })

    const s3 = new S3({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    const url = joinPath(publicEndpoint, destDir)

    const catalog = {
      version,
      url,
      changelog,
      dev,
      minimumEngineVersion
    }

    try {
      await writeFileTo(
        s3,
        bucket,
        joinPath(destDir, version, 'specification.json')
      )(joinPath(srcDir, 'specification.json'))

      await writeFileTo(
        s3,
        bucket,
        joinPath(destDir, version, 'bundle.js')
      )(joinPath(srcDir, 'bundle.js'))

      await writeTo(
        s3,
        bucket,
        joinPath(destDir, version, 'catalog-info.yaml')
      )(`name: ${name}\nversion: ${version}\n`)

      await updateRegistry(
        readFrom(s3, bucket, joinPath(destDir, 'index.json')),
        writeTo(s3, bucket, joinPath(destDir, 'index.json')),
        { name, description, logo },
        catalog
      )

      core.setOutput('url', joinPath(publicEndpoint, destDir))
    } catch (err) {
      if (onFail === 'delete') {
        await s3.deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: [
              {
                Key: joinPath(destDir, version, 'bundle.js')
              },
              {
                Key: joinPath(destDir, version, 'specification.json')
              }
            ]
          }
        })
      }
      throw err
    } finally {
      s3.destroy()
    }
  } catch (error) {
    console.error(error)
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
    try {
      const result = await s3.getObject({ Bucket: bucket, Key: location })
      return result.Body?.transformToString('utf-8')
    } catch (err) {
      return undefined
    }
  }
}

main()
