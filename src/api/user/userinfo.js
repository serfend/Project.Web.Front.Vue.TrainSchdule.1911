import request from '@/utils/request'

/**
 * 获取用户摘要信息
 *
 * @export
 * @param {*} id
 * @param {*} ignoreErr 是否忽略错误
 * @returns
 */
export function getUserSummary(id, ignoreErr) {
  return request.get('users/summary', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}
/**
 * 基础信息
 * @description > ``` response
   {
    Id:"",//用户唯一标识号，可为身份号或身份证号,
    RealName:"姓名",
    Company:"单位名称",//后续可能拓展为单位基础信息,
    职务:"职务名称",
  }
  ```
 */
export function getUserBase(id, ignoreErr) {
  return request.get('users/base', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}

export function getUserDiy(id, ignoreErr) {
  return request.get('users/diyinfo', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}
/**
 * 社会关系 Get /Users/social
 * @description
 ```
 {
    Home:{//家庭
        zipCode://邮编
        Address://详细地址
    },
    Phone:联系方式
}
```
 */
export function getUserSocial(id, ignoreErr) {
  return request.get('users/social', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 * 职务信息 Get /Users/duties
 * @description
 ```
 {
    id:101
    Name:"干事"
 }
```
 */
export function getUserDuties(id, ignoreErr) {
  return request.get('users/duties', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 * 获取用户系统信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getUserApplication(id, ignoreErr) {
  return request.get('users/application', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 * 单位信息 Get /Users/company
 * @description
 ```
  {
      Company:{
          Name:"单位名称",
        Code:"ADJC1A22",
        Parent:"上级单位名称"
      },
      Duties:"职务名称"
  }
 ```
 */
export function getUserCompany(id, ignoreErr) {
  return request.get('users/company', {
    params: {
      id
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 *通过身份证号查询身份号
 *
 * @export
 * @param {*} cid
 * @param {*} ignoreErr 是否忽略错误
 * @returns
 */
export function getUserIdByCid(cid, ignoreErr) {
  return request.get('/account/GetUserIdByCid', {
    params: {
      cid
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 *通过真实姓名查询身份号
 *
 * @export
 * @param {*} realName
 * @returns
 */
export function getUserIdByRealName(realName, ignoreErr) {
  return request.get('/account/GetUserIdByRealName', {
    params: {
      realName
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 * 获取用户休假限制时长和次数
 * @param {*} id
 * @param {int} yearIndex
 */
export function getUsersVacationLimit(id, yearIndex, ignoreErr) {
  return request.get('/users/vacation', {
    params: {
      id,
      yearIndex
    },
    respondErrorIngore: ignoreErr
  })
}

/**
 * 获取用户头像
 *
 * @export
 * @param {string} id 用户id，默认为当前用户
 * @param {guid} avatarId 头像id，默认为null
 * @returns
 */
export function getUserAvatar(id, avatarId, ignoreErr) {
  return request.get('/users/avatar', {
    params: {
      userId: id,
      avatarId
    },
    respondErrorIngore: ignoreErr
  })
}
/**
 *修改用户头像
 *
 * @export
 * @param {*} newAvatar
 * @returns
 */
export function postUserAvatar(newAvatar, ignoreErr) {
  return request.post('/users/avatar', {
    url: newAvatar
  }, { respondErrorIngore: ignoreErr })
}

/**
 * 获取指定用户的审批流
 *
 * @export
 * @param {*} id
 * @returns
 */
export function auditStream(id) {
  return request.get('/users/auditStream', {
    params: { id }
  })
}
