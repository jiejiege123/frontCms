import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/yzzj',
    component: () => import('@/views/pages/Yanzzj/index'),
    hidden: true
  },
  {
    path: '/admin',
    component: () => import('@/views/pages/Welcome/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/welcome',
    // name: '控制台',
    // meta: { title: '控制台', icon: 'dashboard' },
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/views/pages/Welcome/index'),
        meta: { title: '欢迎页', aicon: 'iconhome' }
      }
    ]
  },
  {
    path: '/write',
    component: Layout,
    redirect: '/writePost',
    name: 'write',
    meta: { title: '撰写', aicon: 'icontubiao-' },
    children: [
      {
        path: 'writePost',
        name: 'WritePost',
        component: () => import('@/views/pages/Write/WritePost/index'),
        meta: { title: '文章', aicon: '' }
      },
      {
        path: 'writePage',
        name: 'WritePage',
        component: () => import('@/views/pages/Write/WritePage/index'),
        meta: { title: '页面', aicon: '' }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/managePosts',
    name: '管理',
    meta: { title: '管理', aicon: 'iconmenu' },
    children: [
      {
        path: 'managePosts',
        name: 'ManagePosts',
        component: () => import('@/views/pages/Manage/ManagePosts/index'),
        meta: { title: '文章管理', aicon: '' }
      },
      {
        path: 'managePages',
        name: 'ManagePages',
        component: () => import('@/views/pages/Manage/ManagePages/index'),
        meta: { title: '独立页面', aicon: '' }
      },
      {
        path: 'manageThumbs',
        name: 'ManageThumbs',
        component: () => import('@/views/pages/Manage/ManageThumbs/index'),
        meta: { title: '动态', aicon: '' }
      },
      {
        path: 'manageCategories',
        name: 'ManageCategories',
        component: () => import('@/views/pages/Manage/ManageCategories/index'),
        meta: { title: '分类', aicon: '' }
      },
      {
        path: 'manageTags',
        name: 'ManageTags',
        component: () => import('@/views/pages/Manage/ManageTags/index'),
        meta: { title: '标签', aicon: '' }
      },

      {
        path: 'manageComments',
        name: 'ManageComments',
        component: () => import('@/views/pages/Manage/ManageComments/index'),
        meta: { title: '评论', aicon: '' }
      },
      {
        path: 'manageMedias',
        name: 'ManageMedias',
        component: () => import('@/views/pages/Manage/ManageMedias/index'),
        meta: { title: '文件', aicon: '' }
      },
      {
        path: 'manageUsers',
        name: 'ManageUsers',
        component: () => import('@/views/pages/Manage/ManageUsers/index'),
        meta: { title: '用户', aicon: '' }
      }

    ]
  },
  {
    path: '/option',
    component: Layout,
    redirect: '/optionDiscussion',
    name: '设置',
    meta: { title: '设置', aicon: 'iconsetting' },
    children: [
      {
        path: 'optionDiscussion',
        name: 'OptionDiscussion',
        component: () => import('@/views/pages/Option/OptionDiscussion/index'),
        meta: { title: '评论', aicon: '' }
      },
      {
        path: 'optionReading',
        name: 'OptionReading',
        component: () => import('@/views/pages/Option/OptionReading/index'),
        meta: { title: '阅读', aicon: '' }
      },
      {
        path: 'optionPermalink',
        name: 'OptionPermalink',
        component: () => import('@/views/pages/Option/OptionPermalink/index'),
        meta: { title: '链接', aicon: '' }
      }
    ]
  },
  { path: '*', redirect: '/404' }
  // 404 page must be placed at the end !!!

]
// 拿到获取到的路由
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
