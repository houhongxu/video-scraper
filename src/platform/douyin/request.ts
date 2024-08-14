import { ensureDir, writeJson } from 'fs-extra'
import path from 'path'
import { Browser, Page } from 'puppeteer'
import { ExtraHeaders } from '../../config'
import { LOG_PATH } from '../../const'
import { autoScroll, interceptFile } from '../../puppeteer'
import { wait } from '../../utils'
import { DouyinOptions, SORT_TYPES } from './const'
import { douyinDownload, sortByDigg } from './download'

export function douyinRequest(
  page: Page,
  { url, searchDesc, sortType = SORT_TYPES.desc }: DouyinOptions,
) {
  if (!page) return

  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const LOG_LIST: any[] = []

        // 拦截无用文件
        interceptFile(page, ['font'])

        // 监听并爬取数据
        page.on('response', async (response) => {
          const request = response.request()
          const url = request.url()

          if (url.includes('https://www.douyin.com/aweme/v1/web/aweme/post/')) {
            const result = await response.json()

            const aweme_list = result.aweme_list

            console.log(`爬取数据${aweme_list.length}个`)
            LOG_LIST.push(...aweme_list)

            if (result.has_more == 0 || !aweme_list.length) {
              console.log('写入数据备份')
              const nickname = LOG_LIST[0].author.nickname

              const dirPath = path.join(LOG_PATH, 'douyin')
              ensureDir(dirPath)

              await writeJson(path.join(dirPath, `${nickname}.json`), {
                list: LOG_LIST,
              })

              const listMap = {
                [SORT_TYPES.digg]: sortByDigg(LOG_LIST),
                [SORT_TYPES.desc]: LOG_LIST,
              }

              if (searchDesc) {
                await douyinDownload(
                  LOG_LIST.filter((i) => i.desc.includes(searchDesc)),
                  nickname,
                )
              } else {
                await douyinDownload(listMap[sortType], nickname)
              }
              resolve('爬取结束')
            }
          }
        })

        // 设置浏览器
        await page.setExtraHTTPHeaders(ExtraHeaders)
        await page.setViewport({
          width: 1920,
          height: 1080,
        })

        // 访问
        console.log('开始访问页面')
        await page.goto(url)

        // 关闭登录弹框
        console.log('关闭登录弹框')
        await page.waitForSelector('.login-mask-enter-done')
        await page.click('.dy-account-close')
        await wait()

        // 自动滚动
        await autoScroll(page)
      } catch (err) {
        reject(err)
      }
    })()
  })
}
