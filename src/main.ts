import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  let stdout = ''
  let stderr = ''

  try {
    const command = core.getInput('command', { required: true })
    const errorMessagesInput = core.getInput('errorMessages')

    // Parse the multiline input into an array
    const errorMessages = errorMessagesInput
      .split(/\r|\n/) // Split by newlines
      .map((msg) => msg.trim()) // Trim whitespace
      .filter((msg) => msg) // Remove empty lines

    if (!command.trim()) {
      core.setFailed('The "command" input must not be empty.')
      return
    }

    if (errorMessages.length === 0) {
      core.setFailed('The "errorMessages" input must not be empty.')
      return
    }

    let nxCommand = `npx nx ${command}`

    core.info(`Running: ${nxCommand}`)

    const execOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          const text = data.toString()
          stdout += text
          // Log stdout in real time
          process.stdout.write(text)
        },
        stderr: (data: Buffer) => {
          const text = data.toString()
          stderr += text
          // Log stderr in real time
          process.stderr.write(text)
        }
      }
    }

    // Run the Nx command
    try {
      await exec.exec(nxCommand, undefined, execOptions)
    } catch (error) {
      // Combine stderr and stdout for error message inspection
      const combinedOutput = stdout + stderr

      // Check if the output contains any of the specified error messages
      if (errorMessages.some((msg) => combinedOutput.includes(msg))) {
        core.warning(
          'Detected Nx Cloud-related error. Rerunning with --no-cloud...'
        )
        nxCommand += ' --no-cloud'

        try {
          await exec.exec(nxCommand, undefined, execOptions)
        } catch (retryError) {
          core.error(
            'Retry with --no-cloud also failed. Please check your Nx configuration.'
          )

          // Throw the retry error to preserve failure context
          core.setFailed(
            `Retry with --no-cloud also failed. Please check your Nx configuration.`
          )
          throw retryError
        }
      } else {
        // If the error is not related to Nx Cloud, rethrow it
        core.setFailed(`Unhandled error: ${stderr || stdout}`)
        throw error
      }
    }

    core.setOutput('status', 'success')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(
        `Action failed with error: ${error.message}\n\nFull output:\n${
          stdout + stderr
        }`
      )
    }
  }
}
