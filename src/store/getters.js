/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime : 2020-01-02 14:56:45
 * @LastEditors  : Please set LastEditors
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  sysInfo: state => state.user.sysInfo,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  routers: state => state.user.routers,
  routes: state => state.permission.routes,
  finishtip: state => state.user.finishtip,
  verifyFlag: state => state.user.verifyFlag,
  loading: state => state.user.loading
}
export default getters
