import * as core from '@actions/core';
import * as github from '@actions/github';
import * as glob from "@actions/glob";
import { readFileSync, existsSync } from 'fs';

interface Input {
  token: string;
  'include-gitignore': boolean;
  'ignore-default': boolean;
  files: string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result.token = core.getInput('github-token');
  result['include-gitignore'] = core.getBooleanInput('include-gitignore');
  result['ignore-default'] = core.getBooleanInput('ignore-default');
  result.files = core.getInput('files');
  return result;
}

export const runAction = async (octokit: ReturnType<typeof github.getOctokit>, input: Input): Promise<void> => {
  let allFiles: string[] = [];
  if (input.files) {
    allFiles = input.files.split(' ');
    allFiles = await (await glob.create(allFiles.join('\n'))).glob();
  } else {
    allFiles = await (await glob.create('*')).glob();
  }
  core.startGroup(`All Files: ${allFiles.length}`);
  core.info(JSON.stringify(allFiles));
  core.endGroup();

  const codeownerContent = getCodeownerContent();
  core.startGroup('Reading CODEOWNERS File');
  core.endGroup();
  let codeownerFileGlobs = codeownerContent.split('\n')
    .map(line => line.split(' ')[0])
    .filter(file => !file.startsWith('#'))
    .map(file => file.replace(/^\//, ''));
  if (input['ignore-default'] === true) {
    codeownerFileGlobs = codeownerFileGlobs.filter(file => file !== '*');
  }

  const codeownersGlob = await glob.create(codeownerFileGlobs.join('\n'));
  let codeownersFiles = await codeownersGlob.glob();
  core.startGroup(`CODEOWNERS Files: ${codeownersFiles.length}`);
  core.info(JSON.stringify(codeownersFiles));
  core.endGroup();
  codeownersFiles = codeownersFiles.filter(file => allFiles.includes(file));
  core.info(`CODEOWNER Files in All Files: ${codeownersFiles.length}`);
  core.startGroup('CODEOWNERS');
  core.info(JSON.stringify(codeownersFiles));
  core.endGroup();



  let filesCovered = codeownersFiles;
  let allFilesClean = allFiles;
  if (input['include-gitignore'] === true) {
    let gitIgnoreFiles: string[] = [];
    if(!existsSync('.gitignore')){
      core.warning('No .gitignore file found');
    } else {
      const gitIgnoreBuffer = readFileSync('.gitignore', 'utf8');
      const gitIgnoreGlob = await glob.create(gitIgnoreBuffer);
      gitIgnoreFiles = await gitIgnoreGlob.glob();
      core.info(`.gitignore Files: ${gitIgnoreFiles.length}`);
    }
    allFilesClean = allFiles.filter(file => !gitIgnoreFiles.includes(file));
    filesCovered = filesCovered.filter(file => !gitIgnoreFiles.includes(file));
  }
  if (input.files) {
    filesCovered = filesCovered.filter(file => allFilesClean.includes(file));
  }
  const coveragePercent = (filesCovered.length / allFilesClean.length) * 100;
  const coverageMessage = `${filesCovered.length}/${allFilesClean.length}(${coveragePercent.toFixed(2)}%) files covered by CODEOWNERS`;
  core.notice(coverageMessage, {
    title: 'Coverage',
    file: 'CODEOWNERS'
  });

  const filesNotCovered = allFilesClean.filter(f => !filesCovered.includes(f));
  core.info(`Files not covered: ${filesNotCovered.length}`);

  if (github.context.eventName === 'pull_request') {
    const checkResponse = await octokit.rest.checks.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      name: 'Changed Files have CODEOWNERS',
      head_sha: github.context.payload.pull_request?.head.sha || github.context.payload.after || github.context.sha,
      status: 'completed',
      completed_at: (new Date()).toISOString(),
      output: {
        title: 'Codeowners check!',
        summary: `Summary`,
        annotations: filesNotCovered.map(file => ({
          path: file,
          annotation_level: 'failure' as 'failure',
          message: 'File not covered by CODEOWNERS',
          start_line: 0,
          end_line: 1,
        })).slice(0, 50),
      },
      conclusion: coveragePercent < 100 ? 'failure' : 'success',
    });
    console.log('Check Response OK: ', checkResponse.status);
  }
}

export async function run(): Promise<void> {
  try {
    const input = getInputs();
    const octokit: ReturnType<typeof github.getOctokit> = github.getOctokit(input.token);
    return runAction(octokit, input);
  } catch (error) {
    core.startGroup(error instanceof Error ? error.message : JSON.stringify(error));
    core.info(JSON.stringify(error, null, 2));
    core.endGroup();
  }
};


function getCodeownerContent(): string {
  if(existsSync('CODEOWNERS')) {
    return readFileSync('CODEOWNERS', 'utf8')
  }
  if(existsSync('.github/CODEOWNERS')){
    return readFileSync('.github/CODEOWNERS', 'utf8');
  }
    throw new Error('No CODEOWNERS file found');
}
