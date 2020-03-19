<!--
 * @Author: your name
 * @Date: 2019-11-01 10:18:26
 * @LastEditTime: 2020-03-16 14:55:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-ui\src\views\pages\Info\Staffs\index.vue
 -->
<template lang="pug">
.content.layout-column
  .header.layout-row__between
    .query
      //- 审核状态查询
      el-input.input-search(
        placeholder='请输入页面名称'
        v-model='search'
        size="mini"
        clearable
        style="width:230px"
        @clear="doSearch")
        el-button(slot="append" icon="el-icon-search" type="primary" size="mini" @click="doSearch")
    //- .operate
    //-   //- v-if="userInfo.UserType === 'Company'"
    //-   el-button(
    //-     type="primary"
    //-     size="mini"
    //-     @click='createdRow') 新增
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
      el-table-column(label="标题" align="left" prop="title")
      el-table-column(label="状态" align="center" prop="status")
      el-table-column(label="创建时间" align="center" prop="creatTime")
      el-table-column(label="更新时间" align="center" prop="updateTime")
      el-table-column(label="顺序" align="center" prop="upIndex")
      el-table-column(label="评论" align="center" prop="comments")
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
</template>
<script >
import {
  getPages,
  delPages } from '@/api/index'
import ImageDialog from '@/components/ImageDialog'
import { mapGetters } from 'vuex'
import { toTree, parseTime } from '@/utils'
import DialogForm from '@/components/DialogForm'
import LongDatePicker from '@/components/LongDatePicker'
import 'viewerjs/dist/viewer.css'

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
          label: '名称',
          prop: 'cagName'
        },
        {
          label: '父级',
          prop: 'pid',
          type: 'select'
        },
        {
          label: '字段',
          prop: 'eName'
        },
        {
          label: '顺序',
          prop: 'upIndex',
          type: 'number'
        },
        {
          label: '说明',
          prop: 'decs',
          type: 'textarea',
          online: true
        }
      ],
      rules: {
        cagName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        eName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }]
      },
      categories: '',
      categoriesData: [],
      tags: '',
      tagsData: [],
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
      if (column.property === 'status') {
        switch (row.status) {
          case '草稿':
            // 未提交
            return 'approve-wait'
          case '已发布':
            // 审核中
            return 'approve-pass'
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
    /** *** 按钮点击 start ******/
    /**
     * @description: 编辑数据
     * @param {type}
     */
    editRow(row) {
      // 跳转页面
      this.$router.push({
        path: '/Write/WritePage',
        query: {
          id: row.id,
          name: row.title
        }
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
        delPages({ id: row.id }).then(res => {
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
      getPages(params).then(resS => {
        this.$nextTick(() => {
          this.loading = false
        })
        setTimeout(() => {
          this.$refs.reftable.doLayout()
        }, 200)

        const tableData = resS.Data.data
        tableData.forEach(n => {
          if (n.updateTime > parseTime(new Date().getTime())) {
            n.status = '草稿'
          } else {
            n.status = '已发布'
          }
        })
        this.tableData = tableData
        this.total = resS.Data.total
      }).catch(err => {
        this.loading = false
        console.error(err)
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
