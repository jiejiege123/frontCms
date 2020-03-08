/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-21 16:07:15
 * @LastEditTime : 2020-01-14 09:42:53
 * @LastEditors  : Please set LastEditors
 */
import { constantRoutes } from '@/router'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const view404 = resv => require([`@/views/pages/404.vue`], resv)

const actions = {
  generateRoutes({ commit }, routers) {
    return new Promise(resolve => {
      const addRoutes = []
      // 将数组写成路由标准路由格式
      routers.map(n => {
        const childrenComponents = []
        n.Children = n.Children || []
        n.Children.map(nC => {
          let comp
          try { comp = require(`@/views/pages/${n.Url}/${nC.Url}/index.vue`) } catch (e) {
            console.log(e)
          }
          if (comp && comp.default) {
            childrenComponents.push(
              {
                path: nC.Url,
                name: 'nc' + nC.Id,
                component: (res) => require([`@/views/pages/${n.Url}/${nC.Url}/index.vue`], res),
                meta: { title: nC.Name }
              }
            )
          } else {
            childrenComponents.push(
              {
                path: nC.Url,
                name: 'nc' + nC.Id,
                component: view404,
                meta: { title: nC.Name }
              }
            )
          }
        })
        addRoutes.push(
          {
            path: `/${n.Url}`,
            alwaysShow: true,
            component: Layout,
            redirect: `/${n.Url}/${n.Children[0].Url}`,
            name: 'c' + n.Id,
            meta: { title: n.Name, ficon: n.Icon },
            children: childrenComponents
          }
        )
      })
      commit('SET_ROUTES', addRoutes)
      resolve({
        addRoutes: state.addRoutes,
        allRoutes: state.routes
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
