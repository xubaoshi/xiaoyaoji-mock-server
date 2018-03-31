const Mock = require('mockjs')

const Random = Mock.Random

const FieldTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY_NUMBER: 'array[number]',
  ARRAY_BOOLEAN: 'array[boolean]',
  ARRAY_STRING: 'array[string]',
  ARRAY_OBJECT: 'array[object]',
  DATE: 'date',
}

const DefaultFields = {
  pageNo: [1, 10],
  pageSize: [10, 10],
  records: [1, 100],
  pages: [1, 10],
}

const mockDefaultField = fieldName => {
  if (fieldName === 'records' || fieldName.includes('page')) {
    return Random.integer(...DefaultFields[fieldName])
  }
  return DefaultFields[fieldName]
}

// 根据类型模拟数据
const mockCollectionByType = ({ type, children, name }, dict) => {
  // 缺省字段的处理
  if (DefaultFields[name]) {
    return mockDefaultField(name)
  }

  // 时间类型
  if (name.includes('time') || name.includes('Time')) {
    return Random.datetime('yyyy-MM-dd HH:mm:ss')
  }

  // 支持字典项
  if (dict && dict[name]) {
    return dict[name][Random.natural(0, dict[name].length - 1)]
  }

  switch (type) {
    case FieldTypes.ARRAY_NUMBER: {
      const dataLen = Random.natural(1, 10)
      const finalData = []
      for (let i = 0; i < dataLen; i++) {
        finalData.push(Random.natural(1, 10))
      }
      return finalData
    }
    case FieldTypes.ARRAY_BOOLEAN: {
      const dataLen = Random.natural(1, 10)
      const finalData = []
      for (let i = 0; i < dataLen; i++) {
        finalData.push(Random.boolean())
      }
      return finalData
    }
    case FieldTypes.ARRAY_STRING: {
      const dataLen = Random.natural(1, 10)
      const finalData = []
      for (let i = 0; i < dataLen; i++) {
        finalData.push(Random.string())
      }
      return finalData
    }
    case FieldTypes.ARRAY_OBJECT: {
      const dataLen = Random.natural(1, 10)
      const finalData = []
      for (let i = 0; i < dataLen; i++) {
        finalData.push(
          children.reduce((a, c) => {
            return {
              ...a,
              [c.name]: mockCollectionByType(c, dict)
            }
          }, {})
        )
      }

      return finalData
    }
    case FieldTypes.OBJECT: {
      const finalData = children.reduce((a, c) => {
        return {
          ...a,
          [c.name]: mockCollectionByType(c, dict)
        }
      }, {})

      return finalData
    }
    case FieldTypes.BOOLEAN:
      return Random.boolean()
    case FieldTypes.NUMBER:
      return Random.natural(0, 1000)
    case FieldTypes.DATE:
      return Random.datetime('yyyy-MM-dd HH:mm:ss')
    case FieldTypes.STRING:
      return Random.string()
    default:
      return Random.string()
  }
}

module.exports = {
  mockCollectionByType
}
