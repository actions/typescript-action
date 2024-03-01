/**
 * Unit tests for src/fetchPullRequest.ts
 */

import { fetchPullRequest } from '../src/fetchPullRequest'
import { expect } from '@jest/globals'
import { equal } from 'assert'
import * as axios from 'axios'

describe('wait.ts', () => {
  it('throws an invalid number', async () => {
    const input = parseInt('foo', 10)
    expect(isNaN(input)).toBe(true)

    await expect(fetchPullRequest('test', input)).rejects.toThrow('Pull request number input is not a number.')
  })

  // it('returns with valid inputs', async () => {
  //   const res: any = fetchPullRequest('lowlydba/dba-multitool', 1)
  //   expect(res.length > 0)

  // })
})
