<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span style="padding-right: 15px">
            <!-- {{ userLy }} -->
          </span>
          <span>
            {{ userInfo.userName }}
          </span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="showModify">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="userInfo.UserType === 'Department'" divided>
            <span style="display:block;" @click="showUpload">上传印章</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      append-to-body
      width="30%"
      class="dialog-class"
      @open="open('pwdform')"
    >
      <el-form ref="pwdform" :model="form" :rules="rules">
        <el-form-item prop="oldPassword" label="原密码" label-width="80px">
          <el-input
            :key="oldPasswordType"
            ref="oldPasswordType"
            v-model="form.oldPassword"
            :type="oldPasswordType"
            placeholder="请输入旧密码"
            name="password"
            tabindex="2"
            size="small"
            auto-complete="on"
          />
          <span slot="suffix" class="show-pwd" @click="showPwd('oldPasswordType')">
            <svg-icon :icon-class="oldPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>

        </el-form-item>

        <el-form-item prop="newPassword" label="新密码" label-width="80px">

          <el-input
            :key="newPasswordType"
            ref="newPasswordType"
            v-model="form.newPassword"
            :type="newPasswordType"
            placeholder="请输入新密码"
            name="password"
            tabindex="2"
            size="small"
            auto-complete="on"
          />
          <span slot="suffix" class="show-pwd" @click="showPwd('newPasswordType')">
            <svg-icon :icon-class="newPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>

        </el-form-item>

        <el-form-item prop="checkPassword" label="确认密码" label-width="80px">

          <el-input
            :key="checkPasswordType"
            ref="checkPasswordType"
            v-model="form.checkPassword"
            :type="checkPasswordType"
            placeholder="请再次输入新密码"
            name="password"
            size="small"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handlePost('pwdform')"
          />
          <span slot="suffix" class="show-pwd" @click="showPwd('checkPasswordType')">
            <svg-icon :icon-class="checkPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>

        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handlePost('pwdform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改信息"
      :visible.sync="dialogUploadVisible"
      append-to-body
      width="30%"
      :close-on-click-modal="false"
      class="dialog-class"
      @open="open('formDialog')"
    >
      <el-form ref="formDialog" :model="infoForm" label-width="80px" :rules="userRules">
        <el-form-item class="pt10" label="公章" prop="Seal">
          <img v-if="infoForm.Seal && formDialog.type==='view' || formDialog.type==='approve'" class="avatar" :src="infoForm.Seal | filterImg" style="margin:10px; cursor: pointer;">
          <el-upload
            v-else
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleSealSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="infoForm.Seal" class="avatar" :src="infoForm.Seal | filterImg">
            <i v-else class="el-icon-plus avatar-uploader-icon" /></el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleUpload('formDialog')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePassword } from '@/api/user'
import md5 from 'js-md5'

// import { updateDepartmentData } from '@/api/system/department'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.pwdform.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // var isPhone = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('app登录名不能为空'))
    //   } else {
    //     if (!checkPhone(value)) {
    //       callback(new Error('app登录名必须是电话号码'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
    // var isPhoneX = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('手机号不能为空'))
    //   } else {
    //     if (!checkPhone(value)) {
    //       callback(new Error('手机号必须是电话号码'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
    return {
      dialogFormVisible: false,
      form: {},
      oldPasswordType: 'password',
      newPasswordType: 'password',
      checkPasswordType: 'password',
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ validator: validatePass, required: true, trigger: 'blur' }],
        checkPassword: [{ validator: validatePass2, required: true, trigger: 'blur' }]
      },
      // 用户弹窗
      dialogUploadVisible: false,
      userRules: {
        Seal: [
          { required: true, message: '公章不能为空', trigger: 'change' }
        ]
      },
      formDialog: {
        visible: false,
        title: '',
        type: 'update'
      },
      infoForm: {},
      imgFile: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'userInfo'
    ]),
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    }
  },
  methods: {
    handleSealSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      const url = res.Data.url
      this.$set(this.infoForm, 'Seal', url)
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
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    showModify() {
      this.dialogFormVisible = true
    },
    /**
     * @description: '提交修改密码'
     * @param {type} ''
     * @return: ''
     */
    handlePost(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newPassword = md5(this.form.newPassword)
          var formData = new FormData()

          formData.append('oldPassword', this.form.oldPassword)
          formData.append('newPassword', newPassword)

          changePassword(formData).then(res => {
            this.$message.success('密码修改成功')
            this.logout()
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    showPwd(type) {
      if (this[type] === 'password') {
        this[type] = ''
      } else {
        this[type] = 'password'
      }
      this.$nextTick(() => {
        this.$refs[type].focus()
      })
    },
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
        this.form = {}
      })
    },
    /** *** 基本设置 start ******/

    showUpload() {
      this.formDialog.type = 'update'
      this.dialogUploadVisible = true
      this.infoForm.Code = this.userInfo.DepartmentMode.Code
      this.infoForm.PCode = this.userInfo.DepartmentMode.PCode
      this.infoForm.Name = this.userInfo.DepartmentMode.Name
      this.infoForm.XZQHCode = this.userInfo.DepartmentMode.XZQHCode
      // this.infoForm.Seal = this.userInfo.DepartmentMode.Seal
      this.$set(this.infoForm, 'Seal', this.userInfo.DepartmentMode.Seal)
    },
    handleUpload(formName) {
      this.$refs[formName].validate((valid) => {
        // if (valid) {
        //   updateDepartmentData(this.infoForm).then(res => {
        //     this.$message.success(res.Msg)
        //     this.dialogUploadVisible = false
        //   }).catch(err => {
        //     console.error(err)
        //   })
        // } else {
        //   console.error('error submit!!')
        //   return false
        // }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 24px;
    margin: 13px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      padding-right: 30px;
      cursor: pointer;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 6px;
          font-size: 12px;
        }
      }
    }
  }
}
.dialog-class{
  /deep/ .el-form-item__content{
    display: flex;

    .show-pwd {
      // position: absolute;
      // right: 10px;
      padding-right: 10px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }
    // .el-input{
    //   width: 220px
    // }
  }
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
</style>
