import * as core from '@actions/core';
import {inspect} from "util";
import colors = module

const github = require('@actions/github');

async function run() {
  try {
      const ms = core.getInput('autoMergeUser');
    console.log(`Waiting ${ms} milliseconds ...`)

      const actionPayload = github.context.payload;

      const testRun = actionPayload.check_run;
      const testRunStatus = testRun.status;
      const testRunConclusion = testRun.conclusion;


      // if the test run has completed successfully
      if (testRunStatus === 'completed' && testRunConclusion === 'success') {

          const testRunPullRequest = testRun.pull_request[0];

          const pullRequestNumber = testRunPullRequest.number;
          const pullRequestSource = testRunPullRequest.head.ref;
          const pullRequestDestination = testRunPullRequest.base.ref;

          const repoInfo = actionPayload.repository;
          const repoOwner = repoInfo.owner.login;
          const repoName = repoInfo.name;



          // make api call for more PR info

          console.log('Making api call for PR: ' + pullRequestNumber + " " + pullRequestSource + ":" + pullRequestDestination);

          const myToken = core.getInput('myToken');
          const octokit = new github.GitHub(myToken);
          const {data: pullRequest} = await octokit.pulls.get({
              repo: repoName,
              owner: repoOwner,
              pull_number: pullRequestNumber
          });

          console.log('Found PR: ' + pullRequest.title);
          console.log('PR raised by: ' + pullRequest.user.login)


      }



    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
