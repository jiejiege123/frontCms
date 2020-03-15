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
    url: '/backend/profile',
    method: 'post',
    data
  })
}

// 获取分类
export function getCategories(params) {
  return request({
    url: '/backend/getCategories',
    method: 'get',
    params
  })
}
export function getCategoriesAll() {
  return request({
    url: '/backend/getCategoriesAll',
    method: 'get'
  })
}
// 添加分类
export function addCategories(data) {
  return request({
    url: '/backend/addCategories',
    method: 'post',
    data
  })
}
// 编辑分类
export function updateCategories(data) {
  return request({
    url: '/backend/updateCategories',
    method: 'post',
    data
  })
}
// 删除分类
export function delCategories(data) {
  return request({
    url: '/backend/delCategories',
    method: 'post',
    data
  })
}


// 获取标签
export function getTags(params) {
  return request({
    url: '/backend/getTags',
    method: 'get',
    params
  })
}
// 添加标签
export function addTags(data) {
  return request({
    url: '/backend/addTags',
    method: 'post',
    data
  })
}
// 编辑标签
export function updateTags(data) {
  return request({
    url: '/backend/updateTags',
    method: 'post',
    data
  })
}
// 删除标签
export function delTags(data) {
  return request({
    url: '/backend/delTags',
    method: 'post',
    data
  })
}

// 获取文章
export function getArticle(params) {
  return request({
    url: '/blog/getArticleList',
    method: 'get',
    params
  })
}
// 添加文章
export function addArticle(data) {
  return request({
    url: '/backend/addArticle',
    method: 'post',
    data
  })
}
// 编辑文章
export function updateArticle(data) {
  return request({
    url: '/backend/updateArticle',
    method: 'post',
    data
  })
}
// 删除文章
export function delArticle(data) {
  return request({
    url: '/backend/delArticle',
    method: 'post',
    data
  })
}
