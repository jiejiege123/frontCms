<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime : 2020-01-17 10:58:53
 * @LastEditors  : Please set LastEditors
 -->
<template lang="pug">
.container.layout-column(
  v-loading="loading")
  .title-container
    .title 民爆信息管理两证验真
  .input-warp
    el-input.input-search(placeholder='请输入验真码' v-model='search'  clearable)
      el-button(slot="append" icon="el-icon-search" type="primary"  @click="doSearch")
  .img-warp
    el-image(
      v-if='img'
      :src='img | filterImg')
    el-image(
      v-if='img2'
      :src='img2 | filterImg')
</template>

<script >
// import { getSqMode } from '@/api/zhengjian'
export default {
  name: 'Index',
  components: {

  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    }
  },
  data() {
    return {
      search: '',
      img: '',
      img2: '',
      loading: false
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    /** *** 通用 start *** **/

    /** *** 通用 end *** **/


    /** *** 按钮操作 start *** **/
    /**
     * @description:
     * @param {type}
     * @return:
     */
    doSearch() {
      this.getData()
    },
    /** *** 按钮操作 end *** **/


    /** *** 接口请求 start *** **/

    /**
     * @description: 获取数据
     * @param {type}
     * @return:
     */
    getData() {
      // const params = {
      //   gettype: '1',
      //   yzm: this.search
      // }
      // this.loading = true
      // getSqMode(params).then(res => {
      //   this.img = res.Data.gmmode.printfile
      //   this.img2 = res.Data.gmmode.printfile2
      //   this.$nextTick(() => {
      //     this.loading = false
      //   }).catch(error => {
      //     console.error(error
      //     )
      //   })
      // })
    }
    /** *** 获取数据 end *** **/


    /** *** 其他 start *** **/

  }
}
</script>
<style lang="scss" scoped>
/***** 基本设置 start ******/
.container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  // overflow: hidden;
  padding-top: 50px;
  .title-container {
    position: relative;
    .title {
      font-size: 20px;
      color: #fff;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .input-warp{
    padding-bottom: 15px;
    margin: 0 auto;
    width: 70%;
    /deep/ .el-input__inner{
      background-color: #2d3a4b;
      color: #fff
    }
    /deep/ .el-input-group__append, .el-input-group__prepend{
      background-color: #2d3a4b;
      .el-button{
        margin: -10px -30px;
        i{
          color: #fff
        }
      }
    }
  }
}
.img-warp{
  /deep/ img{
    width: 100%
  }
}
</style>
