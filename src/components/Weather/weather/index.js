import day from './day'
import night from './night'
import cloudySun from './cloudySun'
import cloudyNight from './cloudyNight'
import windyCloud from './windyCloud'
import windy from './windy'
import rainCloud from './rainCloud'
import rainy from './rainy'
import torrentialRain from './torrentialRain'
import stormy from './stormy'
import lightning from './lightning'
import lightningBolt from './lightningBolt'
import lightSnowy from './lightSnowy'
import snowStorm from './snowStorm'
import hazeDay from './hazeDay'
import unknown from './unknown'
import { hexTorgb } from '@/utils/dashboard'

const map = {
  '晴': day,
  '晴夜': night,
  '晴风': windy,
  '多云': cloudySun,
  '多云风': windyCloud,
  '多云夜': cloudyNight,
  '阴': cloudySun,
  '阵雨': rainCloud,
  '雷阵雨': lightning,
  '雷雨': lightningBolt,
  '雷阵雨伴有冰雹': stormy,
  '雨夹雪': lightSnowy,
  '小雨': rainCloud,
  '中雨': rainy,
  '大雨': torrentialRain,
  '暴雨': torrentialRain,
  '大暴雨': torrentialRain,
  '特大暴雨': torrentialRain,
  '阵雪': lightSnowy,
  '小雪': lightSnowy,
  '中雪': lightSnowy,
  '大雪': lightSnowy,
  '暴雪': snowStorm,
  '雾': hazeDay,
  '冻雨': torrentialRain,
  '沙尘暴': hazeDay,
  '小到中雨': rainCloud,
  '中到大雨': rainy,
  '大到暴雨': torrentialRain,
  '暴雨到大暴雨': torrentialRain,
  '大暴雨到特大暴雨': torrentialRain,
  '小到中雪': lightSnowy,
  '中到大雪': lightSnowy,
  '大到暴雪': snowStorm,
  '浮尘': hazeDay,
  '扬沙': hazeDay,
  '强沙尘暴': hazeDay,
  '浓雾': hazeDay,
  '强浓雾': hazeDay,
  '霾': hazeDay,
  '中度霾': hazeDay,
  '重度霾': hazeDay,
  '严重霾': hazeDay,
  '大雾': hazeDay,
  '特强浓雾': hazeDay,
  '雨': rainy,
  '雪': lightSnowy,
  '无': unknown,
  '未知': unknown,
}
import variables from '@/styles/element-variables.scss'
const themeColor = variables.theme
Object.keys(map).map(i => {
  const raw_func = map[i]
  map[i] = (color, r, g, b) => {
    let o = color ? hexTorgb(color) : { r, g, b }
    if (!color && r === undefined) {
      o = hexTorgb(themeColor)
    }
    return raw_func(o.r / 255, o.g / 255, o.b / 255)
  }
})

const weatherDict = [
  '未知',
  '晴',
  '晴夜',
  '晴风',
  '多云',
  '多云夜',
  '多云风',
  '小雨',
  '中雨',
  '大雨',
  '阵雨',
  '雷电',
  '小雪',
  '大雪',
  '雾霾'
]
const temperatureMockDict = [
  0.2,
  0.18,
  0.16,
  0.14,
  0.12,
  0.10,
  0.09,
  0.15,
  0.2,
  0.3,
  0.5,
  0.7,
  0.83,
  0.92,
  0.95,
  1,
  0.98,
  0.92,
  0.85,
  0.7,
  0.58,
  0.47,
  0.37,
  0.28
]
export default Object.assign({
  weatherDict,
  temperatureMockDict
}, map)
