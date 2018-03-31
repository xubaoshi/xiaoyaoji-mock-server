const request = require('request')
const debug = require('debug')('auto test')

const { mockRequest } = require('./mock.js')
const { isEmpty } = require('../utils/lang')

const testUrl = (url, param, ticket) => new Promise((resolve, reject) => {
  const options = {
    method: 'POST',
    url,
    headers: {
      ticket,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param)
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
        requestArr.push({
          url,
          moduleIndex: i,
          folderIndex: j,
          childIndex: k,
          params: mockRequest(args[0])
        })
      })
    })
  })
  const promises = requestArr.map(data => {
    debug('url:', data.url)
    debug('params:', data.url)
    return testUrl(data.url, data.params, ticket)
  })
  const results = await Promise.all(promises)
  return results
}
module.exports = autoTest
