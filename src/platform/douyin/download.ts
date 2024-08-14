import { ensureDir } from 'fs-extra'
import path from 'path'
import { DOWNLOAD_PATH } from '../../const'
import { download, DownloadItem } from '../../download'

export async function douyinDownload(list: any[], nickname: string) {
  const formatedList = list.map((item: any) => {
    if (
      item.video &&
      item.video.play_addr &&
      item.video.play_addr.url_list &&
      item.video.play_addr.url_list.length
    ) {
      return {
        filename: item.desc.split('#')[0],
        url: item.video.play_addr.url_list[0],
      } as DownloadItem
    } else {
      throw Error('json缺失desc或video')
    }
  })
  const dirPath = path.join(DOWNLOAD_PATH, 'douyin', nickname)
  ensureDir(dirPath)
  download(formatedList, dirPath, 'mp4')
}

export function sortByDigg(list: any[]) {
  return [...list].sort((a, b) => {
    if (
      a.statistics &&
      b.statistics &&
      typeof a.statistics.digg_count === 'number' &&
      typeof b.statistics.digg_count === 'number'
    ) {
      const countA = a.statistics.digg_count
      const countB = b.statistics.digg_count

      return countB - countA
    } else {
      throw Error('json缺失statistics')
    }
  })
}
