<template lang="pug">
el-dialog.dialog-class-dx(
  :title='dialogSmsTitle',
  :visible.sync='dialogSmsVisible'
  width='700px'
  append-to-body
  @open="open('smsForm')"
  @close="closeDialog"
  :close-on-click-modal='false')
  el-form.demo-smsForm.default-input(
    :model='smsForm',
    ref='smsForm',
    label-width='150px')
    el-form-item(
      label='短信标题'
      label-width='100px'
      :rules="[{ required: true, message: '请填写短信标题' }]"
      style='padding-top: 15px; margin-bottom: 20px'
      prop="smstitle")
      el-input(
        size="small"
        placeholder='请填写短信标题',
        v-model='smsForm.smstitle')
    el-form-item()

    el-form-item(
      label='短息内容'
      :rules="[{ required: true, message: '请填写短息内容' }]"
      label-width='100px'
      style='width:100%'
      prop="smsbody")
      el-input(
        size="small"
        type='textarea',
        :autosize='{ minRows: 2, maxRows: 4}',
        placeholder='请填写短息内容',
        v-model='smsForm.smsbody')
    el-form-item(
      label='接收用户'
      label-width='100px'
      prop="d3")
      el-input(
        size="small"
        v-model='smsForm.d3')
    el-form-item(
      label='用户电话'
      label-width='100px'
      prop="phone")
      el-input(
        size="small"
        v-model='smsForm.phone')
    el-form-item.dia-footer()
      el-button(type='primary', @click="submitSmsForm('smsForm')" size="small") 提交
      el-button(@click="closeDialog" size="small") 取消
</template>

<script >
import { addSms } from '@/api/yj'
import { getSysCompanyByCode } from '@/api/system/com'

export default {
  name: 'Index',
  components: {

  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    }
  },
  props: {
    dialogSmsTitle: {
      type: String,
      default: '编辑短信'
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogSmsVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      smsForm: {}
    }
  },
  watch: {
    row(newData, oldData) {
      const ruleForm = Object.assign({}, newData)
      if (this.userInfo.DepartmentCodes.length > 0) {
        ruleForm.DepartmentCode = this.userInfo.DepartmentCodes[0]
        ruleForm.DepartmentName = this.userInfo.Departments[this.userInfo.DepartmentCodes[0]].Name
      } else {
        ruleForm.DepartmentCode = this.userInfo.DepartmentCode || ''
        ruleForm.DepartmentName = this.userInfo.DepartmentName || ''
      }
      ruleForm.senduser = this.userInfo.Name
      // ruleForm.comid = ruleForm.id
      // ruleForm.comname = ruleForm.QF001Zh
      ruleForm.comid = ruleForm.Code
      ruleForm.comname = ruleForm.Name
      ruleForm.smstype = 0
      // 调用接口 获取公司的负责人
      const params = {
        comcode: ruleForm.Code
      }
      getSysCompanyByCode(params).then(res => {
        const row = res.Data
        ruleForm.d3 = row.lxrName
        ruleForm.phone = row.QF005
        ruleForm.ywid = ruleForm.plt001Id
        this.smsForm = ruleForm
      }).catch(err => {
        console.error(err)
      })
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    submitSmsForm(formName) {
      // this.$emit('submitSmsForm', 'smsForm', this.smsForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addSms(this.smsForm).then(res => {
            this.$message.success(res.Msg)
            this.closeDialog()
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-class-dx{
  /deep/ .el-dialog{
    // min-width: 420px;
    .el-form-item__error{
      display: none
    }
  }
  /deep/ .el-dialog__body{
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    .el-input{
      width: 100%
    }
    .demo-smsForm{
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
        width: 50%
      }
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
</style>
