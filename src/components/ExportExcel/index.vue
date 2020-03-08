<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2019-12-12 09:05:47
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
el-button(type="primary" size="small" @click='exportExcel') 导出
</template>

<script>
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'ExportExcel',
  props: {
    tableId: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: '表格文件'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['userInfo'])

  },
  watch: {

  },
  created() {
  },
  methods: {
    exportExcel() {
      /* generate workbook object from table */
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector(this.tableId), xlsxParam)

      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${this.fileName}.xlsx`)
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
