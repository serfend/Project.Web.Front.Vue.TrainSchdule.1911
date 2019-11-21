import request from '../utils/request'
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
export function getUserBase(id) {
  return request.get('users/base', {
    params: {
      id
    }
  })
}

export function getUserDiy(id) {
  return request.get('users/diyinfo', {
    params: {
      id
    }
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
export function getUserSocial(id) {
  return request.get('users/social', {
    params: {
      id
    }
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
export function getUserDuties(id) {
  return request.get('users/duties', {
    params: {
      id
    }
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
export function getUserCompany(id) {
  return request.get('users/company', {
    params: {
      id
    }
  })
}

/**
 *通过身份证号查询身份号
 *
 * @export
 * @param {*} cid
 * @returns
 */
export function getUserIdByCid(cid) {
  return request.get('/account/GetUserIdByCid', {
    params: {
      cid
    }
  })
}

/**
 * 获取用户休假限制时长和次数
 * @param {*} id
 */
export function getUsersVocationLimit(id) {
  return request.get('/users/vocation', {
    params: {
      id
    }
  })
}
