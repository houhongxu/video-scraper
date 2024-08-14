import puppeteer, { Page } from 'puppeteer'
import { LaunchOptions } from './config'
import { DOUYIN_OPTIONS } from './platform/douyin/const'
import { douyinRequest } from './platform/douyin/request'

export async function puppeteerRequest() {
  const browser = await puppeteer.launch(LaunchOptions)

  for (let i = 0; i < DOUYIN_OPTIONS.length; i++) {
    const page = await browser.newPage()
    await douyinRequest(page, DOUYIN_OPTIONS[i])
  }

  browser.close()
}

/**
 * 自动滚动
 */
export async function autoScroll(page: Page) {
  let timer = 0

  await page.evaluate(() => {
    timer = window.setInterval(() => {
      console.log('滚动')
      window.scrollBy(0, 740)

      const html = document.documentElement

      if (html.scrollHeight <= html.scrollTop + html.clientHeight) {
        console.log('触底')
        clearInterval(timer)
      }
    }, 2000)
  })
}

/**
 * 拦截文件请求
 */
export async function interceptFile(
  page: Page,
  types: (
    | 'script'
    | 'image'
    | 'media'
    | 'font'
    | 'document'
    | 'stylesheet'
    | 'texttrack'
    | 'xhr'
    | 'fetch'
    | 'prefetch'
    | 'eventsource'
    | 'websocket'
    | 'manifest'
    | 'signedexchange'
    | 'ping'
    | 'cspviolationreport'
    | 'preflight'
    | 'other'
  )[],
) {
  // 拦截请求
  const blockTypes = new Set(types)

  await page.setRequestInterception(true)

  page.on('request', (request) => {
    const type = request.resourceType()
    const shouldBlock = blockTypes.has(type)

    if (shouldBlock) {
      // 阻止请求
      return request.abort()
    } else {
      // 继续
      return request.continue()
    }
  })
}
