/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as exec from '../__fixtures__/exec.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/exec', () => exec)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Runs successfully with valid inputs', async () => {
    // Mock inputs
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return 'affected -t lint test build'
      }

      if (input === 'errorMessages') {
        return 'Workspace is unable to be authorized\nexceeding the FREE plan'
      }

      return input
    })

    // Run action
    await run()

    // Assertions
    expect(exec.exec).toHaveBeenCalledTimes(1)
    expect(exec.exec).toHaveBeenCalledWith(
      'npx nx affected -t lint test build',
      undefined,
      expect.any(Object)
    )
    expect(core.warning).not.toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('status', 'success')
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Retries with --no-cloud when errorMessages match', async () => {
    // Mock inputs
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return 'affected -t lint test build'
      }

      if (input === 'errorMessages') {
        return 'Workspace is unable to be authorized\nexceeding the FREE plan'
      }

      return input
    })

    // Simulate a failure on the first call and success on the second call
    exec.exec
      .mockImplementationOnce(
        async (command, args, options): Promise<number> => {
          if (options?.listeners?.stdout) {
            options.listeners.stdout(
              Buffer.from('Workspace is unable to be authorized')
            )
          }
          if (options?.listeners?.stderr) {
            options.listeners.stderr(Buffer.from(''))
          }
          return Promise.reject(1)
        }
      )
      .mockImplementationOnce(async (command, args, options) => {
        options?.listeners?.stdout?.call(options, Buffer.from('Retry success'))
        return Promise.resolve(0)
      })

    // Run action
    await run()

    // Assertions
    expect(exec.exec).toHaveBeenCalledTimes(2)
    expect(exec.exec).toHaveBeenNthCalledWith(
      1,
      'npx nx affected -t lint test build',
      undefined,
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenNthCalledWith(
      2,
      'npx nx affected -t lint test build --no-cloud',
      undefined,
      expect.any(Object)
    )
    expect(core.warning).toHaveBeenCalledWith(
      'Detected Nx Cloud-related error. Rerunning with --no-cloud...'
    )
    expect(core.setOutput).toHaveBeenCalledWith('status', 'success')
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Fails when command input is empty', async () => {
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return '   ' // Empty or whitespace-only command
      }
      if (input === 'errorMessages') {
        return 'Some error message'
      }
      return input
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'The "command" input must not be empty.'
    )
    expect(exec.exec).not.toHaveBeenCalled()
  })

  it('Fails when errorMessages input is empty', async () => {
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return 'affected -t lint'
      }
      if (input === 'errorMessages') {
        return '' // Empty error messages
      }
      return input
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'The "errorMessages" input must not be empty.'
    )
    expect(exec.exec).not.toHaveBeenCalled()
  })

  it('Fails when both initial and retry attempts fail', async () => {
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return 'affected -t lint'
      }
      if (input === 'errorMessages') {
        return 'Workspace is unable to be authorized'
      }
      return input
    })

    exec.exec.mockImplementation(
      async (command, args, options): Promise<number> => {
        if (options?.listeners?.stdout) {
          options.listeners.stdout(
            Buffer.from('Workspace is unable to be authorized')
          )
        }
        if (options?.listeners?.stderr) {
          options.listeners.stderr(Buffer.from(''))
        }
        return Promise.reject(1)
      }
    )

    await run()

    expect(exec.exec).toHaveBeenCalledTimes(2)
    expect(exec.exec).toHaveBeenNthCalledWith(
      1,
      'npx nx affected -t lint',
      undefined,
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenNthCalledWith(
      2,
      'npx nx affected -t lint --no-cloud',
      undefined,
      expect.any(Object)
    )
    expect(core.warning).toHaveBeenCalledWith(
      'Detected Nx Cloud-related error. Rerunning with --no-cloud...'
    )
    expect(core.setFailed).toHaveBeenCalledWith(
      'Retry with --no-cloud also failed. Please check your Nx configuration.'
    )
  })

  it('Fails without retry when errorMessages do not match output', async () => {
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return 'affected -t lint'
      }
      if (input === 'errorMessages') {
        return 'Some non-matching error message'
      }
      return input
    })

    exec.exec.mockImplementation(
      async (command, args, options): Promise<number> => {
        if (options?.listeners?.stdout) {
          options.listeners.stdout(Buffer.from('Some unrelated error occurred'))
        }
        if (options?.listeners?.stderr) {
          options.listeners.stderr(Buffer.from(''))
        }
        return Promise.reject(1)
      }
    )

    await run()

    expect(exec.exec).toHaveBeenCalledTimes(1)
    expect(core.warning).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(
      'Unhandled error: Some unrelated error occurred'
    )
  })

  it('Handles unexpected errors gracefully', async () => {
    core.getInput.mockImplementation((input) => {
      if (input === 'command') {
        return 'affected -t lint'
      }
      if (input === 'errorMessages') {
        return 'Workspace is unable to be authorized'
      }
      return input
    })

    exec.exec.mockImplementation(async () => {
      throw new Error('Unexpected error!')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringMatching(/Action failed with error: Unexpected error!/)
    )
  })
})
