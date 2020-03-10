<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime: 2019-09-06 11:37:18
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      @submit.native.prevent
    >

      <div class="title-container">
        <h3 class="title">舴艋舟管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <!-- @keyup.enter.native="handleLogin" -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- <Verify
        ref="slideRef"
        :style="showPoints? '': 'margin-bottom:20px'"
        :type="3"
        :bar-size="barSize"
        :show-button="false"
        @success="slideSuccess"
        @error="alert('error')"
      />
      <Verify
        v-if="showPoints"
        ref="pointRef"
        style="margin-bottom:20px"
        :type="5"
        :show-button="false"
        :img-size="imgSize"
        :img-url="imgUrl"
        :check-num="checkNum"
        @refresh="slideSuccess"
        @checkPoint="checkPoint"
      /> -->
      <!-- <image :src="imgUrl" alt="" srcset="" /> -->
      <el-button
        v-if="!showPoints || isChecked"
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        登录</el-button>

    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import md5 from 'js-md5'
// import Verify from '@/components/Verify/Verify'
import { getCodeImage, codeCheck } from '@/api/user'
export default {
  name: 'Login',
  components: {
    // Verify
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请正确的输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码长度不能少于3位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // username: 'admin',
        // password: 'P@ssw0rd',
        username: '',
        password: '',
        passwordPut: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      // 验证
      barSize: {
        width: '100%',
        height: '40px'
      },
      imgSize: {
        width: '380px',
        height: '200px'
      },
      checkNum: '',
      showPoints: false,
      isChecked: false,
      imgUrl: '',
      checkNow: false
      // finishtip: ''
    }
  },
  computed: {
    // ...mapState({
    //   finishtip: state => state.user.finishtip
    // })
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.$store.dispatch('user/resetToken')
    this.$store.dispatch('tagsView/delAllViews')
    this.$store.commit('user/SET_VERIFYFLAG', false)
    this.$store.commit('user/SET_FINISHTIP', '')
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // if (!this.showPoints && !this.isChecked && this.checkNow) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.passwordPut = md5(this.loginForm.password)
          console.log(this.loginForm)
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            this.checkNow = false
          }).catch((err) => {
            console.error(err)
            this.$store.commit('user/SET_VERIFYFLAG', false)
            this.$store.commit('user/SET_FINISHTIP', '')
            // this.$refs.slideRef.refresh()
            this.loading = false
          })
        } else {
          console.error('error submit!!')
          return false
        }
      })
    },
    /**
   * @description: 滑动验证成功
   * @param {type}
   * @return:
   */
    slideSuccess(cab) {
      this.$store.commit('user/SET_LOADING', true)
      getCodeImage().then(res => {
        this.$store.commit('user/SET_LOADING', false)

        // this.finishtip = res.Data.TipText
        this.$store.commit('user/SET_FINISHTIP', res.Data.TipText)
        this.$store.commit('user/SET_VERIFYFLAG', true)
        this.imgUrl = res.Data.ImageBase64
        this.checkNum = res.Data.Length
        if (cab) {
          cab()
          // cab(this.finishtip)
        }
        this.showPoints = true
      }).catch(err => {
        this.$store.commit('user/SET_LOADING', false)
        console.error(err)
      })
    },
    /**
     * @description: 检查点
     * @param {type}
     * @return:
     */
    checkPoint(checkPosArr, cab) {
      const checkPos = []
      this.$store.commit('user/SET_LOADING', true)
      checkPosArr.forEach(n => {
        checkPos.push(
          {
            '_X': n.x,
            '_Y': n.y
          }
        )
      })
      codeCheck(checkPos).then(res => {
        this.$store.commit('user/SET_LOADING', false)
        // this.finishtip = res.Msg
        this.$store.commit('user/SET_FINISHTIP', res.Msg)
        this.showPoints = false
        this.isChecked = true
        this.checkNow = true
      }).catch(() => {
        this.$refs.pointRef.refresh()
        this.$store.commit('user/SET_LOADING', false)
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 80px 55px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
