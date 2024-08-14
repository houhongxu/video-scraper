import { puppeteerRequest } from './puppeteer'
import { ensureConstsDirsExists } from './utils'

async function main() {
  try {
    await ensureConstsDirsExists()
    await puppeteerRequest()
  } catch (err) {
    console.log('启动失败：', err)
  }
}

main()
