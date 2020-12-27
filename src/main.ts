import * as core from '@actions/core'
import {Octokit} from '@octokit/action'
import {readFileSync} from 'fs'
import {context} from '@actions/github'

export async function getActionUrl(): Promise<string> {
  const {runId, job} = context
  const {owner, repo} = context.repo
  const commandUrl = 'GET /repos/{group}/{repo}/actions/runs/{run_id}/jobs'
  const commandParams = {
    group: owner,
    repo: repo,
    run_id: runId
  }
  const github_token = process.env['GITHUB_TOKEN']
  const octokit = new Octokit({auth: github_token})
  const retval = await octokit.request(commandUrl, commandParams)
  for (const buildNum in retval.data.jobs) {
    if (retval.data.jobs[buildNum].name === job) {
      const runJobId = retval.data.jobs[buildNum].id
      const link = `https://github.com/${owner}/${repo}/runs/${runJobId}?check_suite_focus=true`
      console.log(link)
      return link
    }
  }

  return ''
}

async function run(): Promise<void> {
  try {
    const fileName: string = core.getInput('fileName')
    const text: string = core.getInput('text')
    const repo: string = core.getInput('repo')
    const pullRequestId: string = core.getInput('pull_request_id')
    let messageContent = text
    if (messageContent === '') {
      messageContent = readFileSync(fileName, 'utf-8')
    }
    const buildUrl = await getActionUrl()
    const footer = `\n---\n[action logs](${buildUrl})`
    const textToPublish = messageContent.concat(footer.toString())
    const parts = repo.split('/')
    const commandUrl = 'POST /repos/:org/:repo/issues/:pull_request_id/comments'
    const commandParams = {
      org: parts[0],
      repo: parts[1],
      pull_request_id: pullRequestId,
      body: textToPublish,
      headers: {
        'content-type': 'text/plain'
      }
    }
    core.info(
      `Built url ${commandUrl} with text ${messageContent} pull_request ${pullRequestId} repo ${repo}`
    )
    const octokit = new Octokit()
    await octokit.request(commandUrl, commandParams)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
