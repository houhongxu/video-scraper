import { ensureDir, exists, mkdir } from 'fs-extra'

import * as consts from './const'
export async function ensureConstsDirsExists() {
  const entries = Object.entries(consts)

  for (let [key, value] of entries) {
    if (!key.includes('PATH') || typeof value !== 'string') return

    await ensureDir(value)
  }
}

export async function wait(ms = 1000) {
  if (typeof ms !== 'number') return

  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
