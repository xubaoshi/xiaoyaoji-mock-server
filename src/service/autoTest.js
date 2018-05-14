const request = require('request')
const debug = require('debug')('auto test')

const { mockRequest } = require('./mock.js')
const { isEmpty } = require('../utils/lang')

const testUrl = (data, ticket) => new Promise((resolve, reject) => {
  const options = {
    method: 'POST',
    url: data.url,
    headers: {
      ticket,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.params)
  }
  request(options, (error, response) => {
    // 后端内部统一 code为0时请求成功
    const body = JSON.parse(response.body)
    if (!error && body.code === 0) {
      debug(JSON.stringify(body))
      resolve({ status: 'success',
        result: {
          ...data,
          data: body.data
        } })
    } else {
      debug(JSON.stringify(error))
      resolve({ status: 'error',
        result: {
          ...data,
          errmsg: body.errmsg
        } })
    }
  })
})

async function autoTest(apiList, site, ticket) {
  const result = []
  const requestArr = []
  // 开始模拟测试
  if (isEmpty(apiList)) {
    return result
  }
  // const newApiList = apiList.map(module => {
  //   if (module.name.indexOf('B')) {
      
  //   }
  // })
  apiList.forEach((module, i) => {
    module.folders.forEach((folder, j) => {
      folder.children.forEach((child, k) => {
        if (child.requestMethod !== 'POST') {
          return
        }
        const url = site + child.url.replace('$prefix$', '')
        const args = JSON.parse(child.requestArgs)
        const params = {}
        args.forEach(arg => {
          params[arg.name] = mockRequest(arg)
        })
        !isEmpty(args) && requestArr.push({
          url,
          params,
          moduleIndex: i,
          folderIndex: j,
          childIndex: k,
        })
      })
    })
  })
  const promises = requestArr.map(data => {
    debug('url:', data.url)
    debug('params:', data.url)
    return testUrl(data, ticket)
  })
  const results = await Promise.all(promises)
  results.forEach(value => {
    const resultdata = value.result
    const moduleIndex = resultdata.moduleIndex
    const folderIndex = resultdata.folderIndex
    const childIndex = resultdata.childIndex
    const apiData = apiList[moduleIndex].folders[folderIndex].children[childIndex]
    apiList[moduleIndex].folders[folderIndex].children[childIndex] = {
      ...apiData,
      testResult: resultdata,
      testStatus: value.status,
    }
  })
  return apiList
}

module.exports = autoTest
