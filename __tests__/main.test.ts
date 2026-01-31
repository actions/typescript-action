/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { wait } from '../__fixtures__/wait.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/wait.js', () => ({ wait }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation(() => '500')
    core.isDebug.mockReturnValue(false)

    // Mock the wait function so that it does not actually wait.
    wait.mockImplementation(() => Promise.resolve('done!'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )
  })

  it('Fails fast when input is missing', async () => {
    core.getInput.mockClear().mockReturnValueOnce('')
    await run()
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'Input required and not supplied: milliseconds'
    )
    expect(wait).not.toHaveBeenCalled()
  })

  it('Logs debug info in debug mode', async () => {
    core.isDebug.mockReturnValue(true)
    process.env.GITHUB_ACTIONS = 'true'
    process.env.GITHUB_WORKFLOW = 'ci'
    process.env.GITHUB_RUN_ID = '123'
    process.env.GITHUB_SHA = 'deadbeef'
    process.env.GITHUB_REF = 'refs/heads/main'
    process.env.RUNNER_OS = 'Linux'

    await run()

    const messages = core.debug.mock.calls.map(call => call[0])
    expect(messages.some(msg => msg.includes('Node.js version:'))).toBe(true)
    expect(messages.some(msg => msg.includes('Environment:'))).toBe(true)
  })

  it('Does not log debug env info without debug mode', async () => {
    core.isDebug.mockReturnValue(false)
    await run()
    const messages = core.debug.mock.calls.map(call => call[0])
    expect(messages.some(msg => msg.includes('Node.js version:'))).toBe(false)
    expect(messages.some(msg => msg.includes('Environment:'))).toBe(false)
  })

  it('Sets a failed status', async () => {
    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockReturnValueOnce('this is not a number')

    // Clear the wait mock and return a rejected promise.
    wait
      .mockClear()
      .mockRejectedValueOnce(new Error('milliseconds is not a number'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'milliseconds is not a number'
    )
  })
})
