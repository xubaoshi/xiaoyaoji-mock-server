const request = require('request')
const debug = require('debug')('auto test')

const { isEmpty } = require('../utils/lang')

const privateFn = {
  mockRequestArgs(requestArgs) {
    const result = {}
    const args = JSON.parse(requestArgs)
    if (!isEmpty(args)) {
      args.forEach(arg => {
        result[arg.name] = privateFn.mockDataByType(arg.type)
      })
    }
    return result
  },
  mockDataByType() {
    return 'mock'
  },
  testUrl(url, ticket) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url,
        headers: {
          ticket,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      }
      request(options, (error, response, body) => {
        // 后端内部统一 code为0时请求成功
        if (!error && response.code === 0) {
          debug(JSON.stringify(body))
          resolve(true)
        } else {
          debug(JSON.stringify(error))
          reject(false)
        }
      })
    })
  }
}

async function autoTest(apiList, site, ticket) {
  const result = []
  const requestArr = []
  // 开始模拟测试
  if (isEmpty(apiList)) {
    return result
  }
  apiList.forEach((module, i) => {
    module.folders.forEach((folder, j) => {
      folder.children.forEach((child, k) => {
        const url = site + child.url.replace('$prefix$', '')
        const args = JSON.parse(child.requestArgs)
        // let requestArgs = {}
        // if (!isEmpty(args)) {
        //   args.forEach(arg => {
        //     requestArgs[arg.name] = privateFn.mockDataByType(arg.type)

        //   })
        // }
        requestArr.push({
          url,
          moduleIndex: i,
          folderIndex: j,
          childIndex: k,
          requestArgs: privateFn.mockRequestArgs(child.requestArgs)
        })
      })
    })
  })
  const promises = requestArr.map(data => privateFn.testUrl(data.url))
  const results = await Promise.all(promises)
  return result
}
module.exports = autoTest
