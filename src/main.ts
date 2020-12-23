import * as core from '@actions/core'
import {Octokit} from '@octokit/action'
import {readFileSync} from 'fs'

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
    const commandUrl =
      'POST /repos/:repository/issues/:pull_request_id/comments'
    const commandParams = {
      repository: repo,
      pull_request_id: pullRequestId,
      body: messageContent,
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
