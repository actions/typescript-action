import * as exec from '@actions/exec'

/**
 * @cmd path to the docc command
 */
export const buildDocs = async (
  cmd: string,
  args: string[],
  options: {[key: string]: string},
  env: {[key: string]: string}
): Promise<string> => {
  args = Object.entries(options).reduce((a, [k, v]) => {
    a.push(k, v)
    return a
  }, args)
  const exit = await exec.exec(cmd, args, {env})
  if (exit) {
    throw new Error(`failed to build docs`)
  }
  return options['--output-path']
}
