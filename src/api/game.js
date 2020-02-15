import request from '../utils/request'

export function userinfo(userid) {
  return request.get('/R3/userinfo', {
    params: {
      userid
    }
  })
}

export function gitftcodes(userid) {
  return request.get('/R3/giftcodes', {
    userid
  })
}

export function sharecode(userid, code) {
  return request.get('/R3/sharecode', {
    userid, code
  })
}

export function handlecode(userid, code) {
  return request.get('/R3/handlecode', {
    userid, code
  })
}
