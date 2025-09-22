import * as core from '@actions/core'
import { wait } from './wait.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const msInput = core.getInput('milliseconds')
    const ms = parseInt(msInput, 10)

    if (Number.isNaN(ms)) {
      throw new Error("Input 'milliseconds' must be a valid number.")
    }

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting for ${ms} milliseconds...`)

    const before = new Date().toTimeString()
    core.debug(`Start time: ${before}`)

    await wait(ms)

    const after = new Date().toTimeString()
    core.debug(`End time: ${after}`)

    // Set outputs for other workflow steps to use
    core.setOutput('time', after)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
