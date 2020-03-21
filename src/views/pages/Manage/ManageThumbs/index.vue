<!--
 * @Author: your name
 * @Date: 2019-11-01 10:18:26
 * @LastEditTime : 2020-01-06 15:23:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-ui\src\views\pages\Info\Staffs\index.vue
 -->
<template lang="pug">
.content.layout-column
  .header.layout-row__between
    .query
      //- 审核状态查询
      //- el-select(
      //-   v-model="spvalueSearch"
      //-   placeholder="请选择审核状态"
      //-   filterable
      //-   style="padding-right:15px; width:160px"
      //-   size="mini"
      //-   clearable
      //-   @change="doSearch")
      //-   el-option(
      //-     v-for="(item,index) in dics.spvalue"
      //-     :key="index"
      //-     :label="item.label"
      //-     :value="item.value")
      //- el-select(
      //-   v-model="QF007Search"
      //-   placeholder="请选择岗位类型"
      //-   filterable
      //-   style="padding-right:15px; width:160px"
      //-   size="mini"
      //-   clearable
      //-   @change="doSearch")
      //-   el-option(
      //-     v-for="(item,index) in dics.QF007"
      //-     :key="index"
      //-     :label="item.label"
      //-     :value="item.value")
      el-input.input-search(
        placeholder='请输入查询'
        v-model='search'
        size="mini"
        clearable
        style="width:230px"
        @clear="doSearch")
        el-button(slot="append" icon="el-icon-search" type="primary" size="mini" @click="doSearch")
    .operate
      //- v-if="userInfo.UserType === 'Company'"
      el-button(
        type="primary"
        size="mini"
        @click='createdRow') 新增
      //- el-button(
      //-   type="danger"
      //-   size="mini"
      //-   @click='batchRow') 批量

  .table-warp.flex1.layout-column
    el-table(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      :fit="true"
      ref="reftable"
      :cell-class-name="cellClassName"
      @selection-change="selectionChange"
      empty-text="没有数据"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}")
      el-table-column(type="selection" align="center" width="55")
      el-table-column(label="姓名" align="left" prop="userName")
      el-table-column(label="内容" align="center" prop="bodyCut")
      el-table-column(label="时间" align="center" prop="creatTime")
      el-table-column(label="操作" align="center" fixed="right" width="150px")
        template(slot-scope='scope')
          el-button(
            type="primary"
            @click="editRow(scope.row)"
            size="mini") 编辑
          //- el-button(
          //-   type="success"
          //-   plain
          //-   @click="viewRow(scope.row)"
          //-   size="mini") 详情
          el-button(
            type="danger"
            plain
            @click="deleted(scope.row)"
            size="mini") 删除

    //- 分页
    .pages
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
    //- 弹窗
    el-dialog.dialog-class(
      :title='dialogTitle',
      :visible.sync='dialogVisible'
      width='50%'
      :before-close="handleClose"
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
        el-form-item.dia-footer(
          v-if="(dialogType === 'add' || dialogType === 'update')")
          el-button(type='primary', @click="submitForm('ruleForm')" size="mini") 提交
          el-button(@click="closeDialog" size="mini") 取消
    //- 图片弹窗
    image-dialog(
      :imageTitle="imageTitle"
      :imageVisible="imageVisible"
      :imgUrl='imgUrl'
      @onClose="imageVisible=false"
      )
</template>
<script >
import {
  getThumbs,
  addThumb,
  updateThumb,
  delThumb } from '@/api/index'
import ImageDialog from '@/components/ImageDialog'
import { mapGetters } from 'vuex'
import DialogForm from '@/components/DialogForm'
import LongDatePicker from '@/components/LongDatePicker'
import 'viewerjs/dist/viewer.css'
import { userInfo } from 'os'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    ImageDialog,
    LongDatePicker,
    DialogForm
  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    },
    filterXxx: (val) => {
      switch (val) {
        case '1':
          return '生产出库'
        case '2':
          return '销售出库'
        case '3':
          return '爆破出库'
        default:
          return
      }
    }
  },
  data() {
    return {
      /**
       * 查询
       */
      spvalueSearch: '',
      search: '',
      /**
       * 表格
       */
      loading: false,
      total: 1,
      currentPage: 1,
      pageSize: 20,
      tableData: [],
      tableColumn: [],
      /**
       * 弹框
       */
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: '',
      dialogType: 'add',
      ruleForm: {},
      dics: {},
      formItems: [
        {
          label: '内容',
          prop: 'body',
          type: 'textarea',
          online: true
        }
      ],
      rules: {
        tagName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        eName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }]
      },
      /** 放大图片 */
      imgUrl: '',
      imageVisible: false,
      imageLoading: false,
      imageTitle: '',
      viewerCase: ''
    }
  },
  computed: {
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    },
    ...mapGetters(['sysInfo', 'userInfo'])
  },
  created() {
    // this.getDicDataList()
    this.getDataList()
  },
  mounted() {
  },
  methods: {
    /** *** 基本设置 start ******/
    headerStyle() {
      return 'background-color: #FAFAFA;'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'codespvalueZh') {
        switch (row.codespvalue) {
          case '-1':
            // 未提交
            return 'approve-wait'
          case '0':
            // 审核中
            return 'approve-ing'
          case '1':
            // 通过
            return 'approve-pass'
          // 拒绝
          case '2':
            return 'approve-refused'
          default:
            return 'approve-ing'
        }
      }
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    selectionChange(rows) {
      // console.log(rows)
    },
    doSearch() {
      this.currentPage = 1
      this.pageSize = 20
      this.getDataList()
    },
    handleClose(done) {
      done()
    },
    closeDialog() {
      this.dialogVisible = false
    },
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    // 上传成功
    handleFileSuccess(prop, res, file) {
      if (res.Status === 101) {
        this.$message.error(res.Msg)
      } else {
        const url = res.Data.url
        this.$set(this.ruleForm, prop, url)
      }
    },
    // 上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    /** *** 按钮点击 start ******/
    /**
     * @description: 点击创建按钮
     * @param {type}
     */
    createdRow() {
      this.ruleForm = Object.assign({}, {})
      this.dialogType = 'add'
      this.dialogTitle = '新增'
      this.dialogVisible = true
      // 如果存在就销毁
      this.viewerCase ? this.viewerCase.destroy() : ''
      this.$nextTick(() => {
        this.viewerCase = new this.Viewer(this.$refs.ruleForm.$el)
      })
    },
    /**
     * @description: 编辑数据
     * @param {type}
     */
    editRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.dialogType = 'update'
      // 如果存在就销毁
      this.viewerCase ? this.viewerCase.destroy() : ''
      this.$nextTick(() => {
        this.viewerCase = new this.Viewer(this.$refs.ruleForm.$el)
      })
    },
    /**
     * @description: 查看数据
     * @param {type}
     */
    viewRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.dialogVisible = true
      this.dialogTitle = '人员详情'
      this.dialogType = 'view'
      // 如果存在就销毁
      this.viewerCase ? this.viewerCase.destroy() : ''
      this.$nextTick(() => {
        this.viewerCase = new this.Viewer(this.$refs.ruleForm.$el)
      })
    },
    /**
     * @description: 删除数据
     * @param {row} Object 行数据
     * @return:
     */
    deleted(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delThumb({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDataList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    batchRow() {

    },
    /**
     * @description: 下拉框改变
     * @param {value} 下拉的value
     * @return:
     */
    selectChange(value, type) {

    },
    /**
     * @description: 提交表单
     * @param {type}
     * @return:
     */
    submitForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const method = this.dialogType === 'add' ? addThumb : updateThumb
          this.dialogLoading = true
          this.ruleForm.userId = this.userInfo.id
          this.ruleForm.userName = this.userInfo.userName
          this.ruleForm.creatTime = parseTime(new Date())
          method(this.ruleForm).then(res => {
            this.$nextTick(() => {
              this.dialogLoading = false
            })
            this.closeDialog()
            this.getDataList()
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
    /**
     * @description: 放大图片
     * @param {type}
     * @return:
     */
    showImg(value) {
    },
    /**
     * @description: 修改日期
     * @param {type} ''
     * @return: ''
     */
    onChange(val, name) {
      this.ruleForm[name] = val
    },
    /** *** 接口调用 start ******/
    /**
     * @description: 获取列表数据
     * @param {type}
     * @return:
     */
    getDataList() {
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.search
      }
      this.loading = true
      getThumbs(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        setTimeout(() => {
          this.$refs.reftable.doLayout()
        }, 200)
        const tableData = res.Data.data
        tableData.forEach(n => {
          if (n.body.length > 16) {
            n.bodyCut = n.body.slice(0, 15) + '...'
          } else {
            n.bodyCut = n.body
          }
        })
        // 处理table数据 形成数结构
        this.tableData = tableData
        this.total = res.Data.total
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * @description: 获取部门列表
     * @param {type}
     * @return:
     */
    getDicDataList() {
      const data = ['性别', '民族', '职称', '人员类型', '项目等级', '人员证照名称', '学历', '专业', '审核状态']
      this.$store.dispatch('dics/getDicData', data).then(res => {
        const dics = {}
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key]
            switch (key) {
              case '性别':
                dics.QF002 = element
                break
              case '民族':
                dics.QF003 = element
                break
              case '人员类型':
                dics.QF007 = element
                break
              case '项目等级':
                dics.PlLevle = element
                break
              case '人员证照名称':
                dics.XkzName = element
                break
              case '职称':
                dics.QF006 = element
                break
              case '学历':
                dics.EDU = element
                break
              case '专业':
                dics.major = element
                break
              case '审核状态':
                dics.spvalue = element
                break
              default:
                break
            }
          }
        }
        this.dics = dics
        this.getDataList()
      })
    }

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.content{
  padding: 10px 17px;
  height: calc(100vh - 90px);
}
.header{
  margin: 10px 0 15px;
  .query{
    .input-search{
      width: 200px;

    }
  }
}
.pages{
  margin-top: 20px;
}
/** *** 基本设置 end ******/
.dialog-class{
  /deep/ .el-dialog{
    min-width: 720px;
    .el-form-item__error{
      display: none
    }
  }
  /deep/ .el-dialog__body{
    height: calc(100vh - 150px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    .el-form{
      display: flex;
      flex-wrap: wrap
    }
    .el-form-item{
      width: 50%;
      // margin-bottom: 0px;
    }
    .el-input{
      width: 200px;
    }
    .el-input.is-disabled .el-input__inner{
      background-color: #fff;
      color: #606266
    }
    .el-textarea{
      min-width: 220px;
      // max-width: 80%;
    }
  }
  .dia-footer{
    width: 100% !important;
    text-align: right;
    /deep/ .el-form-item__content{
    text-align: right
    }
  }
}
// 换证弹窗
.dialog-classCertificate{
  /deep/ .el-dialog{
    min-width: 420px;
    .el-form-item__error{
      display: none
    }
  }
  /deep/ .el-dialog__body{
    height: calc(95vh - 145px);
    padding-top: 0;
    padding-bottom: 10px;
    overflow-y: auto;
    .el-form{
      display: flex;
      flex-wrap: wrap
    }
    .el-form-item{
      padding-top: 19px;
      width: 50%;
      margin-bottom: 0px;
    }
    .el-input__inner{
      width: 280px;
    }
    .el-date-editor{
      width: 280px
    }
  }
  .dia-footer{
    width: 100% !important;
    text-align: right;
    /deep/ .el-form-item__content{
    text-align: right
    }
  }
}
.show-pwd {
  position: absolute;
  left: 170px;
  top: 0px;
  font-size: 16px;
  color: #C0C4CC;
  cursor: pointer;
  user-select: none;
}
.margin0{
  margin-bottom: 0px !important;
  width: 50%;
  /deep/ .el-form-item__content{
    line-height: 30px;
  }
}
.approve{
  width: 100%;
  border: 1px solid #888;
  flex-wrap: wrap;
  /deep/ .el-form-item__label{
    line-height: 30px;
  }
  margin-bottom: 15px;
}
.name{
  cursor: pointer;
  text-decoration: underline
}
.upload{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  text-align: center;
  outline: 0;
  &:hover{
    border-color: #409EFF;
  }
}
.avatar-uploader {
  cursor: pointer;
  /deep/ .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover{
      border-color: #409EFF;
    }
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.pt10{
  padding-top: 10px;
}
.default-input{
  /deep/ .is-disabled{
    .el-input__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
    .el-textarea__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
  }
}
.form-warp{
  width: 50%;
  /deep/ .el-form-item{
    width: 100% !important;
    display: flex !important;
    .el-form-item__content{
      flex: 1 !important;
      margin-left: 0 !important;
      .el-input, .el-select, .el-cascader {
        width: 100% !important
      }
    }
  }
}
.online{
  width: 100% !important;
  /deep/ .el-form-item{
    width: 100% !important;
  }
  /deep/ .el-input{
    width: 100% !important
  }
}
</style>
