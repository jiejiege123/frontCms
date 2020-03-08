<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2019-11-20 15:39:52
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.content-warp.layout-row(ref="listForm")
  .content.layout-row(
    v-for="(item,index) in infoItems"
    :class="[item.online?'online':'']")
    .label(:class='[item.align==="left"?"lefts":"rights"]') {{item.label}}
    .span(:class='[item.align==="left"?"lefts":"rights", item.label?"":"border0"]')
      .image(v-if="item.type==='img'")
        span(v-if="infoForm[item.prop] === 'null'")
        div(v-if="item.imgTwo")
          el-image(
            v-if='infoForm[item.prop].split(";")[0]'
            :src='infoForm[item.prop].split(";")[0] | filterImg'
            @click='showImg(infoForm[item.prop].split(";")[0])')
          span(v-else)
          el-image(
            v-if='infoForm[item.prop].split(";")[1]'
            :src='infoForm[item.prop].split(";")[1] | filterImg'
            @click='showImg(infoForm[item.prop].split(";")[1])')
          span(v-else)
        div.layout-row.align-center(v-else-if="item.imgTowText")
          el-image(
            v-if='infoForm[item.prop].split(";")[0]'
            :src='infoForm[item.prop].split(";")[0] | filterImg'
            @click='showImg(infoForm[item.prop].split(";")[0])')
          span(v-else)
          el-image(
            v-if='infoForm[item.prop].split(";")[1]'
            :src='infoForm[item.prop].split(";")[1] | filterImg'
            @click='showImg(infoForm[item.prop].split(";")[1])')
          span(v-else)
          span {{infoForm[item.prop].split(";")[2]}}
          span(v-if="item.imgPhone") ({{infoForm[item.prop].split(";")[3]}})
        div.layout-row.align-center(v-else-if="item.imgText")
          el-image(
            v-if='infoForm[item.prop].split(";")[0]'
            :src='infoForm[item.prop].split(";")[0] | filterImg'
            @click='showImg(infoForm[item.prop].split(";")[0])')
          span(v-else)
          span {{infoForm[item.prop].split(";")[1]}}
          span(v-if="item.imgPhone") ({{infoForm[item.prop].split(";")[2]}})
        el-image(
          v-else-if="infoForm[item.prop]"
          :src='infoForm[item.prop] | filterImg'
          @click="showImg(infoForm[item.prop])")
        span(v-else)
      span(v-else-if="item.type==='dics'") {{infoForm[item.prop] | dicsFilter(item.prop, dics)}}
      span(v-else) {{infoForm[item.prop]}}
</template>

<script >
export default {
  name: 'Index',
  components: {

  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    },
    dicsFilter: (val, prop, dics) => {
      const list = dics[prop].find(n => n.value === val)
      if (list) {
        return list.label
      } else {
        return val
      }
    }
  },
  props: {
    infoItems: {
      type: Array,
      default() {
        return []
      }
    },
    infoForm: {
      type: Object,
      default() {
        return {}
      }
    },
    dics: {
      type: Object,
      default() {
        return {}
      }
    },
    showForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      viewerCase: ''
    }
  },
  computed: {
  },
  watch: {
    showForm: {
      handler: function(val, oldval) {
        if (val) {
          // 如果存在就销毁
          this.viewerCase ? this.viewerCase.destroy() : ''
          this.$nextTick(() => {
            this.viewerCase = new this.Viewer(this.$refs.listForm)
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    showImg(url) {
      this.$emit('onShowImg', url)
    }
  }
}
</script>
<style lang="scss" scoped>
.content-warp{
  flex-wrap: wrap;
  border-bottom: 1px solid #666;
  .content{
    width: 50%;
    .label{
      width:40%;
      text-align: center;
      font-weight: 600;
      line-height: 20px;
      padding: 5px;
      border: 1px solid #666;
      border: 1px solid #666;
      border-bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .lefts{
      border-right: 0
    }
    .label.rights{
      border-left: 0;
      border-right: 0
    }
    .border0{
      border-left: 0 !important;
      border-right: 0 !important;
    }
    .span{
      width:60%;
      line-height: 20px;
      padding: 5px;
      border: 1px solid #666;
      border-bottom: 0;
      display: flex;
      align-items: center;
      .image{
        /deep/ img{
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
      }
    }
  }
}

.online{
  width: 100% !important;
  .label{
    width: 20% !important;
  }
  .span{
    width: 80% !important
  }
}
</style>
