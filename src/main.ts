import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { readFileSync, existsSync } from 'fs';

interface Input {
  'include-gitignore': boolean;
  'ignore-default': boolean;
  files: string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result['include-gitignore'] = core.getBooleanInput('include-gitignore');
  result['ignore-default'] = core.getBooleanInput('ignore-default');
  result.files = core.getInput('files');
  return result;
}

export const runAction = async (input: Input): Promise<void> => {
  let filesToCheck: string[] = [];
  core.startGroup(`Loading files to check.`);
  if (input.files) {
    filesToCheck = input.files.split(' ');
    filesToCheck = await (await glob.create(filesToCheck.join('\n'))).glob();
  } else {
    filesToCheck = await (await glob.create('*')).glob();
  }
  // core.info(JSON.stringify(filesToCheck));
  core.endGroup();

  core.startGroup('Reading CODEOWNERS File');
  const codeownerContent = getCodeownerContent();
  let codeownerFileGlobs = codeownerContent
    .split('\n')
    .map((line) => line.split(' ')[0])
    .filter((file) => !file.startsWith('#'))
    .map((file) => file.replace(/^\//, ''));
  if (input['ignore-default'] === true) {
    codeownerFileGlobs = codeownerFileGlobs.filter((file) => file !== '*');
  }
  const codeownersGlob = await glob.create(codeownerFileGlobs.join('\n'));
  let codeownersFiles = await codeownersGlob.glob();
  // core.info(JSON.stringify(codeownersFiles));
  core.endGroup();

  core.startGroup('Matching CODEOWNER Files with found files');
  codeownersFiles = codeownersFiles.filter((file) =>
    filesToCheck.includes(file),
  );
  core.info(`CODEOWNER Files in All Files: ${codeownersFiles.length}`);
  core.info(JSON.stringify(codeownersFiles));
  core.endGroup();

  if (input['include-gitignore'] === true) {
    core.startGroup('Ignoring .gitignored files');
    let gitIgnoreFiles: string[] = [];
    if (!existsSync('.gitignore')) {
      core.warning('No .gitignore file found');
    } else {
      const gitIgnoreBuffer = readFileSync('.gitignore', 'utf8');
      const gitIgnoreGlob = await glob.create(gitIgnoreBuffer);
      gitIgnoreFiles = await gitIgnoreGlob.glob();
      core.info(`.gitignore Files: ${gitIgnoreFiles.length}`);
      const lengthBefore = filesToCheck.length;
      filesToCheck = filesToCheck.filter(
        (file) => !gitIgnoreFiles.includes(file),
      );
      const filesIgnored = lengthBefore - filesToCheck.length;
      core.info(`Files Ignored: ${filesIgnored}`);
    }
    core.endGroup();
  }

  core.startGroup('Checking CODEOWNERS Coverage');
  const filesNotCovered = filesToCheck.filter(
    (file) => !codeownersFiles.includes(file),
  );
  const amountCovered = filesToCheck.length - filesNotCovered.length;

  const coveragePercent =
    filesToCheck.length === 0
      ? 100
      : (amountCovered / filesToCheck.length) * 100;
  const coverageMessage = `${amountCovered}/${filesToCheck.length}(${coveragePercent.toFixed(2)}%) files covered by CODEOWNERS`;
  core.notice(coverageMessage, {
    title: 'Coverage',
    file: 'CODEOWNERS',
  });
  core.endGroup();
  core.startGroup('Annotating files');
  filesNotCovered.forEach((file) =>
    core.error(`File not covered by CODEOWNERS: ${file}`, {
      title: 'File mssing in CODEOWNERS',
      file: file,
    }),
  );
  core.endGroup();
  if (filesNotCovered.length > 0) {
    core.setFailed(
      `${filesNotCovered.length}/${filesToCheck.length} files not covered in CODEOWNERS`,
    );
  }
};

export async function run(): Promise<void> {
  try {
    const input = getInputs();
    return runAction(input);
  } catch (error) {
    core.startGroup(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
    core.info(JSON.stringify(error, null, 2));
    core.endGroup();
  }
}

function getCodeownerContent(): string {
  if (existsSync('CODEOWNERS')) {
    return readFileSync('CODEOWNERS', 'utf8');
  }
  if (existsSync('.github/CODEOWNERS')) {
    return readFileSync('.github/CODEOWNERS', 'utf8');
  }
  throw new Error('No CODEOWNERS file found');
}
