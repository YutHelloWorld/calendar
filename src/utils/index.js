/**
 * 获取日历展示日期列表
 *
 * @export
 * @param {Number} y
 * @param {Number} m
 * @returns
 */
export function getDateList(y, m) {
  const year = y
  const month = m - 1
  let list = []
  const now = new Date(year, month)
  const monthEnd = new Date(year, month + 1, 0) // 当月最后一天
  const lastMonthEnd = new Date(year, month, 0) // 上月最后一天
  const firstDay = now.getDay() // 当月第一天
  const mEDate = monthEnd.getDate()
  const lMEDate = lastMonthEnd.getDate()

  // 计算上月出现在 📅 中的日期
  for (let i = 0; i < firstDay; i++) {
    const tempM = month > 0 ? month : 12
    const tempY = month > 0 ? year : year - 1
    const strMonth = tempM < 10 ? `0${tempM}` : tempM
    list.unshift(`${tempY}-${strMonth}-${lMEDate - i}`)
  }

  // 当月
  for (let i = 1; i < mEDate + 1; i++) {
    const strI = i < 10 ? '0' + i : i
    const tempM = month + 1
    const strMonth = tempM < 10 ? `0${tempM}` : tempM
    list.push(`${year}-${strMonth}-${strI}`)
  }

  const tempLen = 42 - list.length

  // 下月
  for (let i = 1; i < tempLen + 1; i++) {
    const strI = i < 10 ? '0' + i : i
    const tempM = month + 2 < 13 ? month + 2 : 1
    const tempY = month + 2 < 13 ? year : year + 1
    const strMonth = tempM < 10 ? `0${tempM}` : `${tempM}`
    list.push(`${tempY}-${strMonth}-${strI}`)
  }

  return list
}

/**
 * @name convertDyadicArray 一维数组转换为二维数组
 * @param {Array} arr
 * @param {Number} row
 * @author Sven
 * @example convertDyadicArray([2,3,4,5,6,7], 3) => [[2,3],[4,5],[6,7]]
 */
export function convertDyadicArray(arr, row) {
  let dyadicArray = []
  const col = arr.length / row
  for (let i = 0; i < row; i++) {
    dyadicArray.push(arr.slice(i * col, (i + 1) * col))
  }
  return dyadicArray
}