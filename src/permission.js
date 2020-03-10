/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime : 2020-01-17 09:11:04
 * @LastEditors  : Please set LastEditors
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  if (to.path !== '/404') {
    localStorage.setItem('router', to.path)
  }
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  console.log('hasToken', hasToken)
  // if (hasToken) {
  //   if (to.path === '/login') {
  //   // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     next()
  //     NProgress.done()
  //   }
  // } else {
  //   /* has no token*/
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // 判断路由名称
  //     console.log(to.path)
  //     if (to.path === '/yzzj') {
  //       next()
  //     } else {
  //       next(`/login?redirect=${to.path}`)
  //     }
  //     // other pages that do not have permission to access are redirected to the login page.
  //     NProgress.done()
  //   }
  // }
  if (hasToken) {
    console.log('123')
    if (to.path === '/login') {
      console.log('234')

      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userInfo
      if (hasGetUserInfo) {
        console.log('345')

        next()
        NProgress.done()
      } else {
        console.log('456')
        store.dispatch('user/getInfo').then(userInfo => {
          console.log(userInfo)
          const toPath = localStorage.getItem('router')
          // hasGetUserInfo暂未生效，会再次生成动态路由，先生效会出现build模式无路由的bug
          next({ path: toPath || '/' })
          NProgress.done()
        }).catch(reson => {
          console.error(reson)
          store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        })
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // 判断路由名称
      console.log(to.path)
      if (to.path === '/yzzj') {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
      // other pages that do not have permission to access are redirected to the login page.
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
