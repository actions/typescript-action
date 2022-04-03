import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import * as io from '@actions/io'
import {getBooleanInput, getInput} from '@actions/core'
// TODO remove this dependency
import {Utils} from '@technote-space/github-action-helper'
import {buildDocs} from './build'
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

    // remove current docs
    await io.rmRF(outputPath)

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
    const commitMessage = getInput('commit-message')
    // `TODO define output, which states if there are changes (or abort if there are changes)
    // `TODO refactor this into functions
    if (commit) {
      // `TODO use context to determine branch...
      const branch = Utils.getPrBranch(context)
      if (!branch) {
        core.setFailed('could not determine branch to push changes to')
      }

      await exec.exec('git', ['remote', '-v'])

      await exec.exec('git', ['fetch', 'origin'])
      await exec.exec('git', ['checkout', '-b', branch, `origin/${branch}`])
      await exec.exec('git', ['add', `${outputPath}/*`])
      // TODO check for git status
      await exec.exec('git', [
        'commit',
        '-m',
        commitMessage,
        '--author',
        context.actor
      ])
      await exec.exec('git', ['push'])
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
