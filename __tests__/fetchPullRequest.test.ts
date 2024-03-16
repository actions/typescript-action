/**
 * Unit tests for src/fetchPullRequest.ts
 */

import { fetchPullRequest } from '../src/fetchPullRequest'
import { expect } from '@jest/globals'
import { equal } from 'assert'
import * as axios from 'axios'

describe('fetchPullRequest.ts', () => {
  it('throws an invalid number', async () => {
    const pr_number = parseInt('foo', 10)
    const token = 'thisisatoken'
    expect(isNaN(pr_number)).toBe(true)

    await expect(fetchPullRequest('test', pr_number, token)).rejects.toThrow('Pull request input is not a number.')
  })

  it('returns with valid inputs', async () => {
    const res: any = fetchPullRequest('lowlydba/dba-multitool', 1, 'token-here')
    expect(res.length > 0)
  })

  it('throws for a 404 pull request', async () => {
    const pr_number = 99999
    const token = 'thisisatoken'
    const repo = 'lowlydba/notreal'
    expect(isNaN(pr_number)).toBe(false)

    await expect(fetchPullRequest(repo, pr_number, token)).rejects.toThrow('AxiosError: Request failed with status code 404')
  })

})
