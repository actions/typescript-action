import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import {buildDocs} from './build'
import { getBooleanInput, getInput } from "@actions/core";
import {installDocc} from './install'

const run = async (): Promise<void> => {
  try {
    const context = github.context
    const doccPath = await installDocc()

    const path: string = core.getInput('path')
    let fallbackDisplayName = core.getInput('fallback-display-name')
    if (!fallbackDisplayName) {
      fallbackDisplayName = context.repo.repo
    }

    let fallbackBundleIdentifier = getInput('fallback-bundle-identifier')
    if (!fallbackBundleIdentifier) {
      fallbackBundleIdentifier = context.repo.repo
    }

    const fallbackBundleVersion = getInput('fallback-bundle-version')
    const additionalSymbolGraphDir = getInput('additional-symbol-graph-dir')
    const outputPath: string = getInput('output-path')

    let doccHtmlDir = core.getInput('DOCC_HTML_DIR')
    if (!doccHtmlDir) {
      doccHtmlDir = `${doccPath}/../share/docc/render`
    }
    core.info(`DOCC_HTML_DIR: ${doccHtmlDir}`)

    await buildDocs(
      'docc',
      ['convert', path],
      {
        '--fallback-display-name': fallbackDisplayName,
        '--fallback-bundle-identifier': fallbackBundleIdentifier,
        '--fallback-bundle-version': fallbackBundleVersion,
        '--additional-symbol-graph-dir': additionalSymbolGraphDir,
        '--output-path': outputPath
      },
      {
        DOCC_HTML_DIR: doccHtmlDir
      }
    )

    const commit: boolean = getBooleanInput('commit')
    if (commit) {
      await exec.exec('git', ['add', `${outputPath}/\*`])
      await exec.exec('commit', ['-m', ''])
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
