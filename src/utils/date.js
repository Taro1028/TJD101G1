// src/utils/date.js
import dayjs from 'dayjs';
// 引入 dayjs 的擴充套件，確保可以使用 isSameOrBefore
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; 
dayjs.extend(isSameOrBefore);

/**
 * 獲取指定日期範圍內的所有日期（包含起始和結束日期）
 * @param {string} startStr - 起始日期字串 (YYYY-MM-DD)
 * @param {string} endStr - 結束日期字串 (YYYY-MM-DD)
 * @returns {string[]} 日期字串陣列 (YYYY-MM-DD)
 */
export function getDatesInRange(startStr, endStr) {
  const dates = [];
  // 如果起始或結束日期為空，則直接返回空陣列
  if (!startStr || !endStr) {
    return dates;
  }

  // 使用 dayjs 解析日期字串
  let current = dayjs(startStr);
  const end = dayjs(endStr);

  // 循環，直到當前日期晚於結束日期
  while (current.isSameOrBefore(end, 'day')) { // 使用 isSameOrBefore 進行比較
    dates.push(current.format('YYYY-MM-DD')); // 格式化為 YYYY-MM-DD
    current = current.add(1, 'day'); // 增加一天
  }
  return dates;
}