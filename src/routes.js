const autoTest = require('./service/autoTest')
const { isEmpty } = require('./utils/lang')

const baseUrl = '/board/api'
/**
 * mock server mock server 控制台路由配置
 * @param {*} router  koa-router from genRouter.js
 * @param {*} data    projectDate from genRouter.js
 */
const generateBoardRoutes = (router, data) => {
  // api列表
  router.get(`${baseUrl}`, async (ctx, next) => {
    let list = isEmpty(data) ? [] : data.modules
    list = data.modules.filter(module => module.folders.some(folder => !isEmpty(folder.children)))
    await ctx.render('list', {
      list
    })
  })
  // 选择自动测试环境
  router.get(`${baseUrl}/autoTest`, async (ctx, next) => {
    let environments = JSON.parse(data.project.environments)
    environments = isEmpty(environments) ? [] : environments
    await ctx.render('autoTest', {
      environments
    })
  })

  // 执行自动测试并返回测试结果
  router.post(`${baseUrl}/autoTest`, async (ctx, next) => {
    const param = ctx.request.body
    const list = data.modules.filter(module => module.folders.some(folder => !isEmpty(folder.children)))
    const result = autoTest(list, param.site, param.ticket)
    return result
  })

  return router
}
module.exports = generateBoardRoutes
