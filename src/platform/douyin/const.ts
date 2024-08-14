export enum SORT_TYPES {
  digg = 'digg',
  desc = 'desc',
}

export interface DouyinOptions {
  url: string
  searchDesc?: string
  sortType?: SORT_TYPES
}

export const DOUYIN_OPTIONS: DouyinOptions[] = [
  // {
  //   url: 'https://www.douyin.com/user/MS4wLjABAAAA9qpkMPdaSJ-r7EGAybb1zqUNzRoLFB30jmM4mpgeMfeaSkOO2CY5agti-qntftIl',
  //   sortType: SORT_TYPES.digg,
  // },
  // {
  //   url: 'https://www.douyin.com/user/MS4wLjABAAAAIMIHQyRPqDT3DXCAypPP3ukR2C4IXTFoKngXCvZeQhycAB4AiKo8ZswqQIpfZyu_',
  //   sortType: SORT_TYPES.digg,
  // },
  {
    url: 'https://www.douyin.com/user/MS4wLjABAAAAfeHUJALUV_hro9kN7QT5I9pe9DNVDSkiCTiqfK0ziZo?vid=7293924662881324327',
    sortType: SORT_TYPES.digg,
  },
]
