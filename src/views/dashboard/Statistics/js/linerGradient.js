import * as echarts from 'echarts'
import { rgbIndex, hexTorgb, hexToint, rgbToHex } from '@/utils/dashboard'
export const dashboard = { rgbIndex, hexTorgb, hexToint, rgbToHex }
/**
 * create a liner series base on user set
 *
 * @export
 * @param {String} name
 * @param {String} primaryColor
 * @param {Array} data
 * @returns
 */
export function createLinerSeries(name, primaryColor, data) {
  return {
    name: name,
    type: 'line',
    smooth: true,
    // 单独修改当前线条的样式
    lineStyle: {
      color: primaryColor,
      width: '2'
    },
    // 填充颜色设置
    areaStyle: {
      color: getGradient(primaryColor),
      shadowColor: 'rgba(0, 0, 0, 0.1)'
    },
    // 设置拐点
    symbol: 'circle',
    // 拐点大小
    symbolSize: 8,
    // 开始不显示拐点， 鼠标经过显示
    showSymbol: false,
    // 设置拐点颜色以及边框
    itemStyle: {
      color: primaryColor,
      borderColor: 'rgba(221, 220, 107, .1)',
      borderWidth: 12
    },
    data: data
  }
}

export function getGradient(primaryColor) {
  var c = Object.values(hexTorgb(primaryColor)).join(',')
  var r = [{
    offset: 0,
    color: `rgba(${c}, 0.4)` // 渐变色的起始颜色
  }, {
    offset: 0.8,
    color: `rgba(${c}, 0.1)` // 渐变线的结束颜色
  }]
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, r, false)
}
