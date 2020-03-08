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
      //-   size="small"
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
      //-   size="small"
      //-   clearable
      //-   @change="doSearch")
      //-   el-option(
      //-     v-for="(item,index) in dics.QF007"
      //-     :key="index"
      //-     :label="item.label"
      //-     :value="item.value")
      el-input.input-search(
        placeholder='请输入公司名称或姓名'
        v-model='search'
        size="small"
        clearable
        style="width:230px"
        @clear="doSearch")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")
    .operate
      //- v-if="userInfo.UserType === 'Company'"
      el-button(
        type="primary"
        size="small"
        @click='createdRow') 新增
      //- el-button(
      //-   type="danger"
      //-   size="small"
      //-   @click='batchRow') 批量

  .table-warp.flex1.layout-column
    el-table.flex1(
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
      empty-text="没有数据")
      //- el-table-column(
      //-   type="selection"
      //-   width="55")
      el-table-column(label="#" align="center" type="index" :index="indexMethod" width="55px")
      el-table-column(label="公司名称" align="left" prop="comname" width="150px")
      el-table-column(
        v-for="(item,index) in tableColumn" :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        )
        template(slot-scope='scope')
          span(v-if="item.prop==='xxx'") {{scope.row.xxx | filterXxx}}
          img(
            v-else-if="item.type==='img'"
            :src="scope.row[item.prop] | filterImg"
            @click="showImgDanTable('danTableRef')"
            style="width:40px;height:40px;cursor: pointer")
          span(v-else) {{scope.row[item.prop]}}

      el-table-column(label="操作" align="center" fixed="right" width="220px")
        template(slot-scope='scope')
          el-button(
            type="primary"
            @click="editRow(scope.row)"
            size="small") 编辑
          el-button(
            type="success"
            plain
            @click="viewRow(scope.row)"
            size="small") 详情
          el-button(
            type="danger"
            plain
            @click="deleted(scope.row)"
            size="small") 删除

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
        label-width='140px'
        :rules="rules")
        //- .approve.layout-row(v-if="dialogType!=='add'")
        //-   el-form-item.margin0(label='审核单位')
        //-     span {{ruleForm.codename}}
        //-   el-form-item.margin0(label='审核人')
        //-     span {{ruleForm.codespr}}
        //-   el-form-item.margin0(label='审核状态')
        //-     span {{ruleForm.codespvalueZh}}
        //-   el-form-item.margin0(label='审核时间')
        //-     span {{ruleForm.codesptime}}
        //-   el-form-item.margin0(label='审核意见' style='width:100%')
        //-     span {{ruleForm.codespdemo}}
        //- .form-warp.default-input(v-for="(item,index) in formItems" :class="[item.online?'online':'']")
        //-   el-form-item(
        //-     :key="index"
        //-     :prop='item.prop'
        //-     :label="item.label")
        //-     el-select(
        //-       v-if="item.type === 'select'"
        //-       v-model="ruleForm[item.prop]"
        //-       :placeholder="item.horder || ('请选择' + item.label)"
        //-       size="small"
        //-       :ref="item.prop"
        //-       filterable
        //-       @change="selectChange($event, item.prop)"
        //-       :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        //-       el-option(
        //-         v-for="list in dics[item.prop]"
        //-         :key="list.value"
        //-         :label="list.label"
        //-         :value="list.value")
        //-     el-date-picker(
        //-       v-else-if="item.type === 'date'"
        //-       v-model="ruleForm[item.prop]"
        //-       type="date"
        //-       :placeholder="item.horder || ('请选择' + item.label)"
        //-       size="small"
        //-       value-format="yyyy-MM-dd"
        //-       :editable="false"
        //-       :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        //-     long-date-picker(
        //-       v-else-if="item.type === 'longDate'"
        //-       :valueTime="ruleForm[item.prop]"
        //-       :placeholder="item.horder || ('请选择' + item.label)"
        //-       @onChange="onChange($event, item.prop)"
        //-       :editable="false"
        //-       :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        //-     el-cascader(
        //-       v-else-if="item.type === 'cascader'"
        //-       :options='dics[item.prop]',
        //-       :show-all-levels='false'
        //-       v-model="ruleForm[item.prop]"
        //-       size="small"
        //-       filterable
        //-       :placeholder="item.horder || ('请选择' + item.label)"
        //-       :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        //-     el-input(
        //-       v-else-if="item.type === 'textarea'"
        //-       type='textarea',
        //-       :autosize='{ minRows: 2, maxRows: 4}',
        //-       :placeholder="item.horder || ('请输入' + item.label)"
        //-       v-model='ruleForm[item.prop]'
        //-       :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        //-     div(v-else-if="item.type === 'img'")
        //-       img.avatar(
        //-         v-if='ruleForm[item.prop] && (dialogType==="view")'
        //-         :src='ruleForm[item.prop] | filterImg'
        //-         style="margin:10px; cursor: pointer")
        //-       el-upload.avatar-uploader(
        //-         v-else
        //-         :action='action'
        //-         :show-file-list='false'
        //-         :on-success='(value)=> handleFileSuccess(item.prop, value)'
        //-         :before-upload='beforeAvatarUpload')
        //-         img.avatar(v-if='ruleForm[item.prop]' :src='ruleForm[item.prop] | filterImg')
        //-         i.el-icon-plus.avatar-uploader-icon(v-else)
        //-     el-input(
        //-       v-else
        //-       v-model='ruleForm[item.prop]'
        //-       size="small"
        //-       :type="item.type?item.type:'text'"
        //-       autocomplete = "new-password"
        //-       :placeholder="item.horder || ('请输入' + item.label)"
        //-       :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        //- 审核
        //- el-form-item.pt10(
        //-   v-if="(ruleForm.codespvalue === '0' || ruleForm.codespvalue === '') && (userInfo.UserType === 'Admin' || (userInfo.UserType === 'Department' && userInfo.DepartmentCodes[0] ===ruleForm.SpDepartmentCode))"
        //-   label='审核'
        //-   :rules="[{ required: true }]"
        //-   style='width:100%'
        //-   prop="codespvalue")
        //-   el-radio-group(
        //-     v-model='codespvalue'
        //-     size='small'
        //-     :disabled="dialogType==='view'")
        //-     el-radio(label='1' border='') 通过
        //-     el-radio(label='2' border='') 拒绝
        //- el-form-item.pt10(
        //-   v-if="(ruleForm.codespvalue === '0' || ruleForm.codespvalue === '') && (userInfo.UserType === 'Admin' || (userInfo.UserType === 'Department' && userInfo.DepartmentCodes[0] === ruleForm.SpDepartmentCode))"
        //-   label='审核说明'
        //-   :rules="codespvalue === '2' ? [{ required: true }] : []"
        //-   style='width:100%' prop="codespdemo")
        //-   el-input(
        //-     type='textarea',
        //-     :autosize='{ minRows: 2, maxRows: 4}',
        //-     placeholder='如果拒绝，此项必填',
        //-     v-model='ruleForm.codespdemo'
        //-     :disabled="dialogType==='view'")
        dialog-form(
          :ruleForm="ruleForm"
          :dialogType="dialogType"
          :formItems="formItems"
          :rules="rules"
          :dics="dics"
          )
        el-form-item.dia-footer(
          v-if="userInfo.UserType ===  'Company' && (dialogType === 'add' || dialogType === 'update')")
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
          el-button(@click="closeDialog" size="small") 取消
    //- 图片弹窗
    image-dialog(
      :imageTitle="imageTitle"
      :imageVisible="imageVisible"
      :imgUrl='imgUrl'
      @onClose="imageVisible=false"
      )
</template>
<script >
// import {
//   getStaffsData,
//   addStaffsData,
//   updateStaffsData,
//   deleteStaffsData } from '@/api/staffs'
import ImageDialog from '@/components/ImageDialog'
import { mapGetters } from 'vuex'
import { validateIdCard, parseTime } from '@/utils'
import { checkPhone } from '@/utils/index'
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
    var idCard = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入身份证号'))
      } else {
        if (!validateIdCard(value)) {
          this.$message.error('请输入正确的身份证号')
          callback(new Error('请输入正确的身份证号'))
        } else {
          let birthday = ''
          const idCard = this.ruleForm.QF005
          if (idCard != null && idCard !== '') {
            if (idCard.length === 15) {
              birthday = '19' + idCard.substr(6, 6)
            } else if (idCard.length === 18) {
              birthday = idCard.substr(6, 8)
            }
            birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
          }
          this.$set(this.ruleForm, 'QF004', birthday)
          callback()
        }
      }
    }
    var startTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择有效开始时间'))
      } else {
        if (this.ruleForm.XkzEndTime) {
          if (this.ruleForm.XkzEndTime < value) {
            this.$message.error('证照开始日期应该小于结束日期')
            callback(new Error('开始日期不正确'))
          } else {
            const start = new Date(value)
            const end = new Date(this.ruleForm.XkzEndTime)
            const days = end - start
            const day = parseInt(days / (1000 * 60 * 60 * 24))
            if (day < 360) {
              this.$message.error('证照有效期至少一年')
              callback(new Error('开始日期不正确'))
            } else {
              this.$refs.ruleForm.clearValidate('XkzEndTime')
            }
            callback()
          }
        }
        callback()
      }
    }
    var endTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择有效结束时间'))
      } else {
        if (this.ruleForm.XkzStartTime) {
          if (this.ruleForm.XkzStartTime > this.ruleForm.XkzEndTime) {
            this.$message.error('证照结束日期应该大于开始日期')
            callback(new Error('结束日期不正确'))
          } else {
            const end = new Date(this.ruleForm.XkzEndTime)
            const start = new Date(this.ruleForm.XkzStartTime)
            const days = end - start
            const day = parseInt(days / (1000 * 60 * 60 * 24))
            if (day < 360) {
              this.$message.error('证照有效期至少一年')
              callback(new Error('结束日期不正确'))
            } else {
              this.$refs.ruleForm.clearValidate('XkzStartTime')
            }
            callback()
          }
        }
        callback()
      }
    }

    var isPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('电话不能为空'))
      } else {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
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
      tableColumn: [
        {
          prop: 'kqname',
          label: '库区名称'
        },
        {
          prop: 'planname',
          label: '计划名称'
        },
        {
          prop: 'starttime',
          label: '开始时间'
        },
        {
          prop: 'endtime',
          label: '结束时间'
        },
        {
          prop: 'planvalueZh',
          label: '检查状态'
        },
        {
          prop: 'istongzhiZh',
          label: '是否通知'
        },
        {
          prop: 'iseditZh',
          label: '是否编辑'
        }

      ],
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
          label: '手持终端用户名',
          prop: 'appusername',
          horder: '用户名至少8位数，建议使用手机号',
          disUpdate: true
        },
        {
          label: '手持终端密码',
          prop: 'appuserpass',
          type: 'password'
        },
        {
          label: '姓名',
          prop: 'QF001'
        },
        {
          label: '性别',
          prop: 'QF002',
          type: 'select'
        },
        {
          label: '岗位类型',
          prop: 'QF007',
          type: 'select'
        },
        {
          label: '作业级别',
          prop: 'PlLevle',
          type: 'select'
        },
        {
          label: '证件名称',
          prop: 'XkzName',
          type: 'select'
        },
        {
          label: '证件号',
          prop: 'XkzNo'
        },
        {
          label: '证照有效开始日期',
          prop: 'XkzStartTime',
          type: 'date',
          validator: true
        },
        {
          label: '证照有效结束日期',
          prop: 'XkzEndTime',
          type: 'longDate',
          validator: true
        },
        {
          label: '联系电话',
          prop: 'QF011',
          validator: true
        },
        {
          label: '民族',
          prop: 'QF003',
          type: 'select',
          disUpdate: true
        },
        {
          label: '技术职称',
          prop: 'QF006',
          type: 'select'
        },
        {
          label: '学历',
          prop: 'EDU',
          type: 'select'
        },
        {
          label: '专业',
          prop: 'major',
          // type: 'cascader',
          validator: true
        },
        {
          label: '通讯地址',
          prop: 'QF010'
        },
        {
          label: '身份证号',
          prop: 'QF005',
          validator: true
        },
        {
          label: '身份证发证机关',
          prop: 'QF0051'
        },
        {
          label: '出生日期',
          prop: 'QF004',
          validator: true,
          type: 'brith'
        },
        {
          label: '身份证有效期',
          prop: 'QF0055',
          type: 'img',
          validator: true,
          horder: '截止日期'
        }
      ],
      rules: {
        QF005: [{ validator: idCard, required: true, trigger: 'blur' }],
        QF011: [{ validator: isPhone, required: true, trigger: 'blur' }],
        XkzStartTime: [{ validator: startTime, required: true, trigger: 'blur' }],
        XkzEndTime: [{ validator: endTime, required: true, trigger: 'blur' }],
        QF004: [{ required: false }],
        QF0055: [{ required: true, trigger: 'blur' }],
        major: [{ required: false }]
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
        deleteStaffsData({ spuserIds: row.Id }).then(res => {
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
          const method = this.dialogType === 'add' ? addStaffsData : updateStaffsData
          this.dialogLoading = true
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
      getStaffsData(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        setTimeout(() => {
          this.$refs.reftable.doLayout()
        }, 200)
        const tableData = res.Data.Models
        tableData.forEach(n => {
          n.timestamp = parseTime(n.timestamp)
        })
        this.tableData = res.Data.Models
        this.total = res.Data.TotalCount
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
      margin-bottom: 0px;
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
