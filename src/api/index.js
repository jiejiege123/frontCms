/*
 * @Author: your name
 * @Date: 2020-03-11 08:29:47
 * @LastEditTime: 2020-03-11 11:48:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\oneStep\frontCms\src\api\index.js
 */
import request from '@/utils/request'
// import qs from 'qs'
// 上传图片
export function uploadImage(data) {
  return request({
    url: '/blog/uploadImage',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 个人设置
export function profile(data) {
  return request({
    url: '/blog/profile',
    method: 'post',
    data
  })
}
