import axios from 'axios'
import {
  Message
} from 'element-ui'
import qs from 'qs'
import {
  setTimeout
} from 'timers'

var warningInfoLog = {

}
// const CancelToken = axios.CancelToken
// // 数据存储
// export const cache = {
//   data: {},
//   set(key, data) {
//     this.data[key] = data
//   },
//   get(key) {
//     return this.data[key]
//   },
//   clear(key) {
//     delete this.data[key]
//   }
// }

// // 建立唯一的key值
// export const buildUniqueUrl = (url, method, params = {}, data = {}) => {
//   const paramStr = (obj) => {
//     if (toString.call(obj) === '[object Object]') {
//       return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
//         result[key] = obj[key]
//         return result
//       }, {}))
//     } else {
//       return JSON.stringify(obj)
//     }
//   }
//   url += `?${paramStr(params)}&${paramStr(data)}&${method}`
//   return url
// }

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASEURL, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 120 * 1000 // request timeout
})
// const defaultOptions = {
//   time: 3e3 // 设置为0，不清除缓存
// }
// const getCache = (config) => {
//   const index = buildUniqueUrl(config.url, config.method, config.params, config.data)
//   const responsePromise = cache.get(index)
//   return {
//     index, responsePromise
//   }
// }
// TODO 增加缓存功能
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.headers['Content-Type'] === 'application/urlencoded') {
      config.data = qs.stringify(config.data)
    }
    // if (!config.ignore_cache) {
    //   const source = CancelToken.source()
    //   config.cancelToken = source.token
    //   const cacher = getCache(config)
    //   const cache = cacher.responsePromise
    //   if (cache) {
    //     // console.log('检测到缓存', cache)
    //     source.cancel(cache)
    //   }
    //   config.cacheIndex = cacher.index
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    // const index = response.config.cacheIndex
    // cache.set(index, res)
    // if (defaultOptions.time !== 0) {
    //   setTimeout(() => {
    //     cache.clear(index)
    //   }, defaultOptions.time)
    // }
    const ignoreError = response.config.ignoreError
    return extract_result(res, ignoreError)
  },
  error => {
    // if (axios.isCancel(error)) {
    //   return extract_result(error.message, false)
    // }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export function extract_result(res, ignoreError) {
  return new Promise((resolve, reject) => {
    // 如果不存在status，说明是直接文件，直接返回
    if (res.status === undefined) return res
    if (res.status === 0) {
      return resolve(res.data)
    } else {
      // 通过缓存方式解决频繁报同一个错误的问题
      if (!ignoreError && !warningInfoLog[res.message]) {
        warningInfoLog[res.message] = new Date()
        setTimeout(() => {
          delete warningInfoLog[res.message]
        }, 5e3)
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        if (res.data && res.data.list) {
          const list = res.data.list
          for (var i = 0; i < list.length; i++) {
            setTimeout((errItem) => {
              Message({
                message: `${errItem.key}:${errItem.message}`,
                type: 'error',
                duration: 5e3
              })
            }, (i + 1) * 2000, list[i])
          }
        }
      }
      return reject(res)
    }
  })
}
export default service
