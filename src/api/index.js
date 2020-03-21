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
    url: '/backend/uploadImage',
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
// 获取基本数据

export function getDataBase(params) {
  return request({
    url: '/blog/getDataBase',
    method: 'get',
    params
  })
}

// 获取分类
export function getCategories(params) {
  return request({
    url: '/blog/getCategories',
    method: 'get',
    params
  })
}
export function getCategoriesAll() {
  return request({
    url: '/blog/getCategoriesAll',
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
    url: '/blog/getTags',
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
export function getArticleById(params) {
  return request({
    url: '/blog/article',
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

// 获取独立页面
export function getPages(params) {
  return request({
    url: '/blog/getPagesList',
    method: 'get',
    params
  })
}
export function getPagesById(params) {
  return request({
    url: '/blog/getPage',
    method: 'get',
    params
  })
}
// 添加独立页面
export function addPages(data) {
  return request({
    url: '/backend/addPages',
    method: 'post',
    data
  })
}
// 编辑独立页面
export function updatePages(data) {
  return request({
    url: '/backend/updatePages',
    method: 'post',
    data
  })
}
// 删除独立页面
export function delPages(data) {
  return request({
    url: '/backend/delPages',
    method: 'post',
    data
  })
}

// 获取动态
export function getThumbs(params) {
  return request({
    url: '/blog/getThumbsList',
    method: 'get',
    params
  })
}
// 添加动态
export function addThumb(data) {
  return request({
    url: '/backend/addThumb',
    method: 'post',
    data
  })
}
// 编辑动态
export function updateThumb(data) {
  return request({
    url: '/backend/updateThumb',
    method: 'post',
    data
  })
}
// 删除动态
export function delThumb(data) {
  return request({
    url: '/backend/delThumb',
    method: 'post',
    data
  })
}

export function getArticleOrder(params) {
  return request({
    url: '/blog/getArticleOrder',
    method: 'get',
    params
  })
}
