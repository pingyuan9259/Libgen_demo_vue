/* 配置表
 * 作者：张军祥
 * 创建：2017 */

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'
const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/) || loc.hostname.match(/([^.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for appId & appLogo
try {
  if (!TOP_LEVEL_HOST) {
    throw new Error('url is wrong!')
  }
} catch (err) {
  console.log(err)
}

// localStorage
let SOTRAGE_PREFIX = 'xsdx'

export {
  TOP_LEVEL_HOST,
  APP_ENV,
  ENV,
  SOTRAGE_PREFIX
}
