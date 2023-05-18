import * as core from '@actions/core'
import {wait} from './wait'
import {
  getWorkspaceId
} from './create-run'

async function run(): Promise<void> {
  try {
    console.log("entering run")
    const organization: string = core.getInput('organization')
    const workspace: string = core.getInput('workspace')
    process.env.api_token = core.getInput('apiToken')

    //terraform execution
    const workspaceId = await getWorkspaceId(organization,workspace)
    console.log("workspace id is "+ workspaceId)
  

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
