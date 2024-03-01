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
    const repo: string = core.getInput('repository')
    const prNumber: string = core.getInput('pr-number')

    fetchPullRequest(repo, parseInt(prNumber))
      .then(function (response) {
        const $ = cheerio.load(response.data)

        const sidebarContext = '.sidebar-assignee'
        const codeownerSelector = 'button[id*="codeowner-"]'
        const pendingCodeOwnerSelector = 'tool-tip[for*="review-"]'

        // Codeowners
        const codeowner: Array<String> = $(codeownerSelector, sidebarContext).map((i, x) => $(x).attr('id')?.split('-')[1].trim()).toArray()
        const countCodeowner: number = codeowner.length

        if (countCodeowner < 1) {
          core.notice("No code owners detected in the pull request.")
          return core.ExitCode.Success
        }

        // Pending
        const pending: Array<String> = []
        $(pendingCodeOwnerSelector, sidebarContext).map(function () {
          const name = $(this).text().split(' ')[$(this).text().split(' ').length - 1].trim()
          if (codeowner.indexOf(name) != -1) { //TODO Find out what the approved message is
            pending.push(name)
          }
        });
        const countPending: number = pending.length

        if (countPending < countCodeowner) {
          core.setFailed("Code owners pending approval: " + pending.sort())
        }

        core.setOutput('approved', codeowner)
        core.setOutput('approved-count', countCodeowner - countPending)
        core.setOutput('pending', pending)
        core.setOutput('pending-count', countPending)
      })
      .catch(function (err: Error) {
        if (err instanceof Error) core.setFailed(err.message)
      })
  }
  catch {

  }
};
