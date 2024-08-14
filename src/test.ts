import { readJSON } from 'fs-extra'
import path from 'path'
import { LOG_PATH } from './const'

readJSON(path.join(LOG_PATH, 'douyin', '小乔..json')).then(({ list }) => {
  const res = list.map((i: any) => i.desc)
  console.log(res)
})
