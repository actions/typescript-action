import * as core from '@actions/core';

async function run() {
  const myInput = core.getInput('myInput');
  core.debug(`Hello ${myInput}`)
}

run();