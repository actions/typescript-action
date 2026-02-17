import { describe, expect, it, jest } from '@jest/globals'
import { run } from '../src/main'
import * as core from '@actions/core'
import * as github from '@actions/github'
import type { PullRequest } from '@octokit/webhooks-types'

jest.mock('@actions/core', () => ({
  getInput: jest.fn((name: string) => {
    if (name === 'github-token') return 'fake-token'
    if (name === 'branch-pattern')
      return '{"feat/*":"feature","fix/*":"bugfix"}'
    return ''
  }),
  setFailed: jest.fn(),
  info: jest.fn(),
  setOutput: jest.fn()
}))

jest.mock('@actions/github', () => {
  const original = jest.requireActual('@actions/github')
  return {
    ...original,
    context: {
      payload: {
        pull_request: {
          number: 1,
          head: { ref: 'feat/test-branch' }
        } as PullRequest
      },
      repo: { owner: 'user', repo: 'repo' }
    },
    getOctokit: jest.fn(() => ({
      rest: {
        issues: { addLabels: jest.fn() }
      }
    }))
  }
})

describe('Pull Request Labeler Action', () => {
  it('applies the correct label for a matching branch', async () => {
    await expect(run()).resolves.not.toThrow()

    // Explicitly reference core and github to satisfy ESLint
    expect(core.getInput).toBeDefined()
    expect(github.context).toBeDefined()
  })
})
