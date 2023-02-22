import * as core from '@actions/core'
import {wait} from './wait'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url', {required: true})
    const attempts: number = parseInt(core.getInput('attempts') || '500', 10)
    const interval: number = parseInt(core.getInput('interval') || '1000', 10) // millieseconds
    const expectedContent: string = core.getInput('expectedContent')

    console.log(
      `Polling url ${url} for ${attempts} attempts with a delay of ${interval}`
    )
    console.log('Awaiting specified content: ' + expectedContent)

    let currentAttempt = 1

    while (currentAttempt <= attempts) {
      let response;
      try {
        response = await axios.get(url, {timeout: interval})
      } catch (error) {
        console.log(`attempt ${currentAttempt} threw error: ${error}`);
        await wait(interval)
        currentAttempt++
        continue; // skip rest of current iteration
      }

      if (String(response?.data) === expectedContent) {
        console.log('expected content found... proceeding')
        process.exit(0)
      }

      console.log(
        `attempt ${currentAttempt} gave code: ${response?.status} with content: ${String(response?.data)}`
      )

      await wait(interval)
      currentAttempt++
    }

    throw new Error(
      `Error: Failed to receive expected content within specified attempts/interval.`
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
    process.exit(1)
  }
}

run()
