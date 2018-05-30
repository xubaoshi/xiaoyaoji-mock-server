const autoTest = require('./service/autoTest')
const { isEmpty } = require('./utils/lang')

const baseUrl = '/mock/apiList'
const getSubMenu = (list, menuId) => {
  if (!isEmpty(list)) {
    const module = list.find(menu => menu.id === menuId)
    return isEmpty(module.folders) ? [] : module.folders
  }
  return []
}
const getDataSource = (subMenuList, subMenuId) => {
  if (!isEmpty(subMenuList)) {
    const module = subMenuList.find(subMenu => subMenu.id === subMenuId)
    return isEmpty(module.children) ? [] : module.children
  }
  return []
}

/**
 * mock server mock server 控制台路由配置
 * @param {*} router  koa-router from genRouter.js
 * @param {*} data    projectDate from genRouter.js
 */
const generateBoardRoutes = (router, data) => {
  // api列表
  router.get('/mock/apiList', async (ctx, next) => {
    let list = isEmpty(data) ? [] : data.modules
    let menuId = ctx.query.menuId ? ctx.query.menuId : undefined
    let subMenuId = ctx.query.subMenuId ? ctx.query.subMenuId : undefined
    list = data.modules.filter(module => module.folders.some(folder => !isEmpty(folder.children)))
    const menuList = list.map(module => {
      return { name: module.name, id: module.id }
    })
    menuId = !menuId && !isEmpty(menuList) ? menuList[0].id : menuId
    const subMenuList = getSubMenu(list, menuId)
    subMenuId = !subMenuId && !isEmpty(subMenuList) ? subMenuList[0].id : subMenuId
    const dataSource = getDataSource(subMenuList, subMenuId)
    await ctx.render('list', {
      list,
      menuList,
      subMenuList,
      menuId,
      subMenuId,
      dataSource,
    })
  })
 
  // 选择自动测试环境
  router.get(`${baseUrl}/autoTest`, async (ctx, next) => {
    let environments = JSON.parse(data.project.environments)
    environments = isEmpty(environments) ? [] : environments
    await ctx.render('autoTest/index', {
      environments
    })
  })

  // 执行自动测试并返回测试结果
  router.post(`${baseUrl}/autoTest`, async (ctx, next) => {
    const param = ctx.request.body
    const apiList = data.modules.filter(module => module.folders.some(folder => !isEmpty(folder.children)))
    const list = await autoTest(apiList, param.site, param.ticket)
    await ctx.render('autoTest/result', {
      list
    })
  })

  return router
}
module.exports = generateBoardRoutes
