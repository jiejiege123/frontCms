<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-03-16 14:59:15
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.index(v-loading='loading')
  label.mr_10 标题
  el-input(size="small" v-model="title" style='width: 400px;margin-bottom: 10px' placeholder="标题")
  label.mr_10.ml_20 标识
  el-input(size="small" v-model="eName" placeholder="标识" style="width: 150px")
  label.mr_10.ml_20 图标
  el-input(size="small" v-model="icon" placeholder="图标" style="width: 150px")
  #editor.layout-row()
    mavon-editor.flex1(
      v-model="mdValue"
      style="height: 100%"
      ref='md'
      codeStyle="monokai"
      :toolbars="toolbars"
      @change="change"
      @imgAdd="imgAdd"
      @imgDel="imgDel")
    .right-warp.layout-column
      .right-list.layout-column
        label.mb_10 发布日期
        el-date-picker.mb_15(
          v-model="updateTime"
          type="datetime"
          size="small"
          style='width: 100%'
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择发布日期")
      //- 分类
      .right-list.layout-column
        label.mb_10 顺序
        el-input(v-model.number="upIndex" oninput="value=value.replace(/[^\\d]/g,'')" size="small" placeholder="请输入展示顺序")
      .right-footer
        el-button(type="success" size="small" @click="submit") 提交

      //- el-upload.upload-demo(
      //-   ref="upload"
      //-   :action="action"
      //-   :on-success='handlefileSuccess'
      //-   multiple
      //-   name="images"
      //-   :before-upload='beforeAvatarUpload')
      //-   el-button(size="small" type="primary") 点击上传
</template>

<script >
import { uploadImage } from '@/api/index'
import { mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import { parseTime, toTree } from '@/utils'
import {
  addPages,
  getPagesById,
  updatePages } from '@/api/index'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'Index',
  components: {
    mavonEditor
  },
  data() {
    return {
      loading: false,
      img_file: {},
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: false, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      id: '',
      mdHtml: '',
      mdValue: '',
      updateTime: '',
      title: '',
      eName: '',
      icon: '',
      tags: [],
      categoriesData: [],
      tagsData: [],
      defaultExpanded: [],
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'cagName'
      },
      upIndex: 0
    }
  },
  computed: {
    action() {
      return `${process.env.VUE_APP_BASE_API}/blog/uploadImage`
    },
    ...mapGetters(['userInfo'])
  },
  created() {
    console.log(this.$route.query.id)
    this.id = this.$route.query.id

    if (this.id) {
      this.getPagesByIdData()
    }
    // this.getBaseData()
  },
  mounted() {
  },
  methods: {
    /** ********** 通用 start ************ **/
    handlefileSuccess(res, file) {
      if (res.Status === 400) {
        this.$message.error(res.Msg)
      } else {
        console.log(res, file)
      }
    },
    // 上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG /png格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    /** ********** 通用 end ************ **/

    /** ********** 操作 start ************ **/
    imgAdd(pos, $file) {
      // 缓存图片信息
      this.img_file[pos] = $file
      // this.submit()
    },
    imgDel(pos) {
      delete this.img_file[pos]
    },
    submit() {
      if (this.title && this.eName) {
        if (this.img_file.length > 0) {
          // 第一步.将图片上传到服务器.
          var formdata = new FormData()
          for (var _img in this.img_file) {
            formdata.append('images', this.img_file[_img])
          }
          this.loading = true
          uploadImage(formdata).then(res => {
            console.log(res)
            res.imgPath.forEach((n, index) => {
              this.$refs.md.$img2Url(index + 1, process.env.VUE_APP_BASE_API + n.path)
            })
            this.loading = false
            this.submitForm()
          }).catch(err => {
            console.error(err)
            this.loading = false
          })
        } else {
          this.submitForm()
        }
      } else {
        this.$message.error('请填写标题')
      }
    },
    change(md, text) {
      this.mdHtml = text
    },
    /** ********** 操作 end ************ **/

    /** ********** 接口 start ************ **/
    getPagesByIdData() {
      this.loading = true
      getPagesById({ id: this.id }).then(res => {
        this.loading = false
        this.artcile = res.Data
        this.mdValue = res.Data.md
        this.title = res.Data.title
        this.eName = res.Data.eName
        this.icon = res.Data.icon
        this.upIndex = res.Data.upIndex
      }).catch(err => {
        this.loading = false
        console.error(err)
      })
    },
    submitForm() {
      this.loading = true
      const params = {
        title: this.title,
        body: this.mdHtml,
        upIndex: this.upIndex,
        updateTime: this.updateTime,
        eName: this.eName,
        md: this.mdValue,
        icon: this.icon
      }
      if (!this.id) {
        params.creatTime = parseTime(new Date())
      }
      if (!this.updateTime) {
        params.updateTime = parseTime(new Date())
      }
      let methods
      if (this.id) {
        methods = updatePages
        params.id = this.id
      } else {
        methods = addPages
      }
      methods(params).then(res => {
        this.$message.success('添加成功')
        this.loading = false
        this.$router.push('/manage/managePages')
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    }
    /** ********** 接口 end ************ **/

  }
}
</script>
<style lang="scss" scoped>
.right-warp{
  min-width: 240px;
  padding-left: 10px;
  .right-footer{
    text-align: right;
    margin-top: 15px;
  }

}
.index{
  padding: 15px;
  height: 100%;
  width: 100%;
  /deep/ .v-note-wrapper{
    z-index: 1;
  }
}
#editor{
  height: calc(100% - 42px);
}
.right-list{
  /deep/ .el-tree{
    border: 1px solid #d4d4d4;
    padding: 10px 0;
  }
}
</style>
