<template lang="pug">
el-dialog.image-class(
  :title='imageTitle',
  :visible.sync='imageVisible'
  :width='width'
  append-to-body
  :top="top"
  :close-on-click-modal='false'
  :before-close="close")
  .img-warp.layout-row.align-center
    img(
      :src='imgUrl | filterImg')
  slot
</template>

<script >
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
    imgUrl: {
      type: String,
      default: ''
    },
    imageTitle: {
      type: String,
      default: '查看图片'
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '10vh'
    },
    imageVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {

  },
  methods: {
    close() {
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="scss" scoped>

.image-class{
  /deep/ .el-dialog__body{
    height: calc(100vh - 250px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
  }
  .img-warp{
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
