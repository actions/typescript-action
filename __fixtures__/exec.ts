import type * as actionsExec from '@actions/exec'
import { jest } from '@jest/globals'

export const exec = jest.fn<typeof actionsExec.exec>()
