import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * @return path to the docc executable
 */
export const installDocc = async (): Promise<string> => {
  let path = ''
  const exit = await exec.exec('xcrun', ['--find', 'docc'], {
    listeners: {
      stdout: data => {
        path += data
      }
    }
  })
  path = path.trim()
  path = path.replace(/\/docc$/g, '')
  if (exit) {
    throw new Error(`xcrun --find docc failed`)
  }
  if (!path) {
    throw new Error(`could not find docc`)
  }
  core.addPath(path)
  return path
}
