
const { mockCollectionByType } = require('../utils/mock')

function mockResponse(response, dict) {
  const finalResponse = {
    code: 0,
    errmsg: '接口响应描述',
  }
  const responseData = response[2]
  if (responseData) {
    finalResponse.data = mockCollectionByType(responseData, dict)
  }

  return finalResponse
}

function mockRequest(requestArgs) {
  return mockCollectionByType(requestArgs)
}

module.exports = { mockResponse, mockRequest }
