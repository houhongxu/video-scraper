import { readJSON, stat, writeFile } from 'fs-extra'
import path from 'path'
import { DEFAULT_CONCURRENCY, DOWNLOAD_PATH } from './const'
import axios from 'axios'
import { formatBytes } from './utils'

export interface DownloadItem {
  filename?: string
  url: string
}

export async function download(
  list: DownloadItem[],
  dirPath: string,
  suffix: string,
  concurrency = DEFAULT_CONCURRENCY,
) {
  console.log(`下载共${list.length}个`)

  try {
    if (list.length <= concurrency) {
      concurrencyDownload(list, dirPath, suffix)
    } else {
      for (
        let i = 0;
        i < list.length - (concurrency - 1);
        i = i + concurrency
      ) {
        const concurrencyList = list.slice(i, i + concurrency)
        await concurrencyDownload(concurrencyList, dirPath, suffix, i)
      }
    }

    const { size: curDirSize } = await stat(dirPath)
    const { size: downloadDirSize } = await stat(DOWNLOAD_PATH)
    console.log(`当前文件共${formatBytes(curDirSize)}`)
    console.log(`下载文件共${formatBytes(downloadDirSize)}`)
  } catch (err) {
    console.log('下载失败：', err)
  }
}

async function concurrencyDownload(
  concurrencyList: DownloadItem[],
  dirPath: string,
  suffix: string,
  offset = 0,
) {
  const tasks = concurrencyList.map(async ({ filename, url }, index) => {
    console.log(`开始下载第${offset + index + 1}个:${filename}`)

    const { data: buffer } = await axios({
      url,
      responseType: 'arraybuffer',
    })

    writeFile(
      path.join(dirPath, `${offset + index + 1}.${filename}.${suffix}`),
      buffer,
    )

    console.log(`下载完成第${offset + index + 1}个:${filename}`)
  })

  await Promise.all(tasks)
}
