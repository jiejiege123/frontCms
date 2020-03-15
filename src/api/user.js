/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime : 2019-12-30 16:09:07
 * @LastEditors  : Please set LastEditors
 */
import request from '@/utils/request'
// import qs from 'qs'

export function login(params) {
  const data = JSON.stringify(params)
  return request({
    url: '/login',
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo(params) {
  return request({
    url: '/blog/getInfo',
    method: 'get',
    params
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/Accounts/ChangePassword',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
