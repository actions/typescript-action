import * as core from "@actions/core";
import * as github from "@actions/github";
import {PullRequest, PullRequestEvent} from "@octokit/webhooks-types";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  switch (github.context.eventName) {
    case "pull_request": // https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request
      const pullRequestEvent = github.context.payload as PullRequestEvent;
      switch (pullRequestEvent.action) {
        case "opened":
          onPullRequestOpen(pullRequestEvent.pull_request);
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

function onPullRequestOpen(pullRequest: PullRequest) {
  core.info(`base:${pullRequest.base} head:${pullRequest.head}`);
}
