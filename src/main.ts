import * as core from '@actions/core'
import {wait} from './wait'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url', {required: true})
    const attempts: number = parseInt(core.getInput('attempts') || '100', 10)
    const interval: number = parseInt(core.getInput('interval') || '1000', 10) // millieseconds
    const expectedContent: string = core.getInput('expectedContent')

    console.log(
      `Polling url ${url} for ${attempts} attempts with a delay of ${interval}`
    )
    let currentAttempt = 1

    while (currentAttempt <= attempts) {
      console.log('attempt ' + currentAttempt)
      const response = await axios.get(url, {timeout: interval})
      if (response.data === expectedContent) {
        process.exit(0);
      }

      await wait(interval)

      currentAttempt++
    }

    throw new Error(`Error: Failed to receive expected content within specified attempts/interval.`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
