export function toQueryStartEndByArray(datetime) {
  if (datetime && datetime[0]) {
    return {
      start: datetime[0],
      end: datetime[1]
    }
  } else {
    return null
  }
}

export function toQueryValue(value) {
  if (value !== null && value !== undefined && value !== '') {
    return {
      value
    }
  }
  return null
}

export function toQueryStartEnd(start, end) {
  return toQueryStartEndByArray([start, end])
}

export function toQueryArrays(arr) {
  if (arr && arr.length > 0) {
    return {
      arrays: arr
    }
  }
  return null
}

export default {
  toQueryArrays,
  toQueryStartEnd,
  toQueryValue,
  toQueryStartEndByArray
}
