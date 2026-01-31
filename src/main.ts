import * as core from '@actions/core'
import { wait } from './wait.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    if (!ms.trim()) {
      throw new Error('Input required and not supplied: milliseconds')
    }

    if (core.isDebug()) {
      core.debug(`Node.js version: ${process.version}`)
      const envSummary = {
        GITHUB_ACTIONS: process.env.GITHUB_ACTIONS,
        GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW,
        GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
        GITHUB_SHA: process.env.GITHUB_SHA,
        GITHUB_REF: process.env.GITHUB_REF,
        RUNNER_OS: process.env.RUNNER_OS
      }
      core.debug(`Environment: ${JSON.stringify(envSummary)}`)
    }

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
