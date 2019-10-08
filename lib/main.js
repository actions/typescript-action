"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const github = require('@actions/github');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userToAllowAutoMerge = core.getInput('autoMergeUser');
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
                const myToken = core.getInput('github_token');
                const octokit = new github.GitHub(myToken);
                const { data: pullRequest } = yield octokit.pulls.get({
                    repo: repoName,
                    owner: repoOwner,
                    pull_number: pullRequestNumber
                });
                console.log('Found PR: ' + pullRequest.title);
                console.log('PR raised by: ' + pullRequest.user.login);
                console.log('PR data: \n' + JSON.stringify(pullRequest, undefined, 2));
                if (userToAllowAutoMerge === pullRequest.user.login) {
                    console.log("okay to merge!");
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
