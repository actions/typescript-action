import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs from action.yml
    const token: string = core.getInput('github-token', { required: true })
    const patternsJSON: string = core.getInput('branch-pattern', {
      required: true
    })
    const patterns: Record<string, string> = JSON.parse(patternsJSON)

    const context = github.context

    // Make sure we are in a pull request context
    if (!context.payload.pull_request) {
      core.setFailed('No pull request found in the context.')
      return
    }

    const prNumber: number = context.payload.pull_request.number
    const branchName: string = context.payload.pull_request.head.ref

    core.debug(`PR #${prNumber} is from branch "${branchName}"`)

    // Determine which label to apply
    let labelToApply: string | null = null
    for (const pattern in patterns) {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$')
      if (regex.test(branchName)) {
        labelToApply = patterns[pattern]
        break
      }
    }

    if (!labelToApply) {
      core.info(`No matching label found for branch ${branchName}`)
      return
    }

    core.debug(`Applying label "${labelToApply}" to PR #${prNumber}`)

    // Apply label via GitHub API
    const octokit = github.getOctokit(token)
    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      labels: [labelToApply]
    })

    core.setOutput('label', labelToApply)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// Run the action
run()
