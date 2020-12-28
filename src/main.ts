import * as core from '@actions/core'
import {Octokit} from '@octokit/action'
import {readFileSync} from 'fs'
import {context} from '@actions/github'

function getJobName(job: string, matrixOs: string, matrixNode: string): string {
  let jobName = job
  if (matrixOs && matrixNode) {
    jobName = `${job} (${matrixOs}, ${matrixNode})`
  } else if (matrixOs && !matrixNode) {
    jobName = `${job} (${matrixOs})`
  } else if (!matrixOs && matrixNode) {
    jobName = `${job} (${matrixNode})`
  }
  return jobName
}

export async function getActionUrl(
  matrixOs: string,
  matrixNode: string
): Promise<string> {
  const {runId, job} = context
  const {owner, repo} = context.repo

  const commandUrl =
    'GET /repos/{onerPar}/{repoName}/actions/runs/{runIdPar}/jobs'
  const commandParams = {
    onerPar: owner,
    repoName: repo,
    runIdPar: runId
  }
  const jobName = getJobName(job, matrixOs, matrixNode)
  core.info(`Get action logs ${owner}/${repo} ${runId} ${jobName}`)
  const github_token = process.env['GITHUB_TOKEN']
  const octokit = new Octokit({auth: github_token})
  const retval = await octokit.request(commandUrl, commandParams)

  for (const buildNum in retval.data.jobs) {
    if (retval.data.jobs[buildNum].name === jobName) {
      const runJobId = retval.data.jobs[buildNum].id
      const link = `https://github.com/${owner}/${repo}/runs/${runJobId}?check_suite_focus=true`
      return link
    }
  }
  throw Error(`Job ${job} cannot be found at ${owner}/${repo}`)
}

async function run(): Promise<void> {
  try {
    const fileName: string = core.getInput('fileName')
    const text: string = core.getInput('text')
    const repo: string = core.getInput('repo')
    const pullRequestId: string = core.getInput('pull_request_id')
    const matrixOs: string = core.getInput('matrix_os')
    const matrixNode: string = core.getInput('matrix_node')

    let messageContent = text
    if (messageContent === '') {
      messageContent = readFileSync(fileName, 'utf-8')
    }
    const buildUrl = await getActionUrl(matrixOs, matrixNode)
    const footer = `\n\n---\n[action logs](${buildUrl})`
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
      `PR comment url ${commandUrl} with text ${messageContent} pull_request ${pullRequestId} repo ${repo}`
    )
    core.info(`Action log url ${buildUrl}`)
    const octokit = new Octokit()
    await octokit.request(commandUrl, commandParams)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
