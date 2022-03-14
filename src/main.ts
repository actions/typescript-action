import * as core from '@actions/core'
import { wait } from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.info(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.info(new Date().toTimeString())
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : JSON.stringify(error, null, 2))
  }
}

run()
