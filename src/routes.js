
const { isEmpty } = require('./utils/lang')

const baseUrl = '/board/api'
/**
 * mock server mock server 控制台路由配置
 * @param {*} router  koa-router from genRouter.js
 * @param {*} data    projectDate from genRouter.js
 */
const generateBoardRoutes = (router, data) => {
  router.get(`${baseUrl}`, async (ctx, next) => {
    let list = isEmpty(data) ? [] : data.modules
    list = data.modules.filter(module => module.folders.some(folder => !isEmpty(folder.children)))
    await ctx.render('list', {
      list
    })
  })

  return router
}
module.exports = generateBoardRoutes
