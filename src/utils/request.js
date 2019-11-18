import axios from 'axios'
import {
  Message
} from 'element-ui'
import qs from 'qs'
import {
  setTimeout
} from 'timers'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASEURL, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 10 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.headers['Content-Type'] === 'application/urlencoded') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    if (response.config.responseType === 'stream') {
      const data = response.data
      if (!data) {
        return Promise.reject('下载失败')
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      const configData = JSON.parse(response.config.data)
      const filename = configData.Templete
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
      }, 10)
    }
    const res = response.data
    if (res.status !== 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return res.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
