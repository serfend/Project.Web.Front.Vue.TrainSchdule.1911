import request from '@/utils/request'
/**
 * 获取地区天气
 *
 * @export
 * @param {*} district
 * @param {*} datestart
 * @param {*} dateend
 * @returns
 */
export function getDistrictWeather({ district, datestart, dateend }) {
  return request.get('common/districtWeather', {
    params: {
      district,
      datestart,
      dateend,
    }
  })
}
