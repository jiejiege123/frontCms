<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2019-09-03 10:28:12
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
  .welcome
    h3 网站概要
    .content
      .layout-row.align-center
        span 目前有
        .span-title {{articles}}
        span 篇文章，并有
        .span-title {{types}}
        span 个分类
      p 点击下面的链接快速开始：
      .btn-warp
        el-link(type="primary" @click="goWrite") 撰写新文章
        el-link(type="primary" @click="showDialog('profile')") 个人设置
        el-link(type="primary" @click="showDialog('general')") 系统设置
    .linex
    .content
      h4 最近发布的文章
      .acticle-list
        .acticle-item.layout-row.align-center(v-for="(item,index) in acticleList" :key="item.id")
          .time {{item.updateTime.slice(5,10)}}
          el-link(type="primary" @click="goDetail(item)") {{item.title}}
    //- 弹窗 个人设置和系统设置
    el-dialog.dialog-class(
      :title='dialogTitle',
      :visible.sync='dialogVisible'
      width='50%'
      top="5vh"
      @open="open('ruleForm')"
      :close-on-click-modal='false')
      el-form.demo-ruleForm(
        v-loading="dialogLoading"
        :model='ruleForm',
        ref='ruleForm',
        label-width='80px'
        :rules="rules")
        dialog-form(
          :ruleForm="ruleForm"
          :dialogType="dialogType"
          :formItems="formItems"
          :rules="rules"
          :dics="dics"
          )
        el-form-item.dia-footer()
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
          el-button(@click="closeDialog" size="small") 取消
</template>

<script >
import { profile, getArticleOrder, getCategoriesAll } from '@/api/index'
import DialogForm from '@/components/DialogForm'

import { mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'Index',
  components: {
    mavonEditor,
    DialogForm
  },
  data() {
    return {
      acticleList: [
        {
          time: '3.5',
          title: 'js基本概念'
        },
        {
          time: '3.5',
          title: 'js基本概念'
        }
      ],
      articles: 13,
      types: 8,
      // 弹窗
      dialogTitle: '个人设置',
      dialogVisible: false,
      dialogLoading: false,
      ruleForm: {},
      dialogType: 'update',
      formItems: [],
      rules: {},
      dics: {}
    }
  },
  computed: {
    action() {
      return `${process.env.VUE_APP_BASE_API}/blog/uploadImage`
    },
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getBaseData()
  },
  mounted() {
  },
  methods: {
    /** ********** 通用 start ************ **/
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    closeDialog() {
      this.dialogVisible = false
    },
    /** ********** 通用 end ************ **/

    /** ********** 操作 start ************ **/
    showDialog(type) {
      if (type === 'profile') {
        this.dialogTitle = '个人设置'
        this.formItems = [
          {
            label: '昵称',
            prop: 'userName'
          },
          {
            label: '邮箱',
            prop: 'email'
          },
          {
            label: '头像',
            prop: 'hendPhoto',
            type: 'img'
          }
        ]
        this.getOptionData()
      } else {
        this.dialogTitle = '系统设置'
        this.formItems = [
          {
            label: '站点名称',
            prop: 'sitName'
          },
          {
            label: '个人主页',
            prop: 'homePage'
          },
          {
            label: '站点地址',
            prop: 'sitHttp'
          },
          {
            label: '站点描述',
            prop: 'sitDis'
          },
          {
            label: '关键词',
            prop: 'sitKeys'
          }
        ]
      }
      this.ruleForm = Object.assign({}, this.userInfo)
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          // this.dialogType === 'add' ? mothed = addWorder : mothed = overUpdateWorder
          profile(this.ruleForm).then(res => {
            this.$nextTick(() => {
              this.dialogLoading = false
            })
            this.closeDialog()
            this.$message.success(res.Msg)
            this.$store.dispatch('user/getInfo')
          }).catch(err => {
            this.dialogLoading = false
            console.error(err)
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    goWrite() {
      this.$router.push('/write/writePost')
    },
    goDetail(item) {
      console.log(this.userInfo.homePage)
      window.open(`${this.userInfo.homePage}/detail?id=${item.id}`)
      // 域名下来再跳转
    },
    /** ********** 操作 end ************ **/

    /** ********** 接口 start ************ **/
    getOptionData() {
    },
    getBaseData() {
      const param2 = {
        page: 1,
        pageSize: 10
      }
      Promise.all([getArticleOrder(param2), getCategoriesAll()]).then(res => {
        console.log(res)
        this.articles = res[0].Data[2][0].total
        this.types = res[1].Data.data.length
        this.acticleList = res[0].Data[1]
      }).catch(err => {
        console.error(err)
      })
    }
    /** ********* 接口 end ************ **/

  }
}
</script>
<style lang="scss" scoped>
.welcome{
  width: 800px;
  margin: 0 auto;
  color: #555;
  h3{
    margin: 25px 0 10px;
  }
  .content{
    margin-top: 35px;
    .span-title{
      color: #444;
      font-size: 32px;
      font-style: normal;
      font-family: Georgia,serif;
      line-height: 10px;
      padding: 0 4px 8px 4px;

    }
    .btn-warp{
      padding-top: 5px;
      /deep/ .el-link{
        font-size: 16px;
        margin-right: 25px
      }
    }
  }
  .linex{
    width: 100%;
    height: 1px;
    background-color: #ECECEC;
    margin: 25px 0
  }
  .acticle-list{
    padding-left: 12px;
    .acticle-item{
      margin-bottom: 5px;
      white-space: nowrap;
      .time{
        margin-right: 4px;
        padding-right: 8px;
        border-right: 1px solid #ECECEC;
        width: 50px;
        text-align: right;
        color: #999;
        font-size: 14px;
        line-height: 18px;
      }
      /deep/ .el-link{
        padding-left: 5px;
        line-height: 18px;
      }
    }
  }
}
.dia-footer{
  text-align: right;
}
</style>
