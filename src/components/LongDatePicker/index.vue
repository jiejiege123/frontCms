<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2019-11-04 11:53:05
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
  div
    el-date-picker(
      v-if="values === '2299-12-31' || values === '2299-12-31 00:00:00'"
      v-model="values"
      :disabled="disabled"
      :type="type"
      :placeholder="placeholder"
      :value-format="valueFormat"
      :size="size"
      :editable="editable"
      :picker-options="pickerOptions"
      format="长期"
      @change="onChange")
    el-date-picker(
      v-else
      :disabled="disabled"
      v-model="values"
      :type="type"
      :editable="editable"
      :placeholder="placeholder"
      :value-format="valueFormat"
      :size="size"
      :picker-options="pickerOptions"
      @change="onChange")

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LongDatePicker',
  props: {
    valueTime: {
      type: String,
      default: ''
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    type: {
      type: String,
      default: 'date'
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    pickerOptions: {
      type: Object,
      default() {
        return {
          // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // },
          shortcuts: [
          // {
          //   text: '今天',
          //   onClick(picker) {
          //     picker.$emit('pick', new Date())
          //   }
          // },
          // {
          //   text: '昨天',
          //   onClick(picker) {
          //     const date = new Date()
          //     date.setTime(date.getTime() - 3600 * 1000 * 24)
          //     picker.$emit('pick', date)
          //   }
          // },
            {
              text: '长期',
              onClick(picker) {
                const date = new Date('2299-12-31')
                // date.setTime(date.getTime())
                picker.$emit('pick', date)
              }
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      values: '',
      input: '长期'
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
    // values() {
    //   return this.valueTime
    // }
  },
  watch: {
    valueTime: {
      handler: function(val, oldval) {
        this.values = val
      },
      deep: true, // 对象内部的属性监听，也叫深度监听,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    onChange(val) {
      this.$emit('onChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
