import * as cheerio from 'cheerio';
import * as core from '@actions/core'
import { fetchPullRequest } from './fetchPullRequest';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.getIDToken
    const token: string = core.getInput('repo-token')
    const repo: string = core.getInput('repository')
    const prNumber: string = core.getInput('pr-number', { required: true })

    fetchPullRequest(repo, parseInt(prNumber), token)
      .then(function (response) {
        const $ = cheerio.load(response.data)

        const sidebarContext = '.sidebar-assignee'
        const codeownerSelector = 'button[id*="codeowner-"]'

        // Pending CodeOwners
        const pendingCodeowner: Array<String> = $(codeownerSelector, sidebarContext).map((i, x) => $(x).attr('id')?.split('-')[1].trim()).toArray()
        const countCodeowner: number = pendingCodeowner.length

        if (countCodeowner === 0) {
          core.notice("No pending code owners detected in the pull request.")
          core.setOutput('numPendingCodeOwner', countCodeowner)
          return core.ExitCode.Success
        }
        else {
          core.setOutput('numPendingCodeOwner', countCodeowner)
          core.setFailed(`${countCodeowner} pending CodeOwner reviews.`)
        }
      })
      .catch(function (err: Error) {
        throw new Error(err.message)
      })
  }
  catch (err) {
    if (err instanceof Error) core.setFailed(err.message)
  }
};
