<template lang="pug">
.ftable
  el-table(
    :data='pageData'
    style='width: 100%'
    :header-cell-style='headerStyle'
    :height="height"
    :border="border"
    :fit="fit"
    :empty-text="emptyText")
    slot
  .pages
    el-pagination(
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length")
</template>

<script >
export default {
  name: 'Index',
  components: {

  },
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    height: {
      type: Number,
      default: 250
    },
    headerStyle: {
      type: Function,
      default: () => {}
    },
    border: {
      type: Boolean,
      default: true
    },
    fit: {
      type: Boolean,
      default: true
    },
    emptyText: {
      type: String,
      default: '没有数据'
    }
  },
  data() {
    return {
      total: 1,
      currentPage: 1,
      pageSize: 20,
      search: '',
      pageData: []
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleCurrentChange(e) {
      this.currentPage = e
      this.setData()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.setData()
    },
    doSearch() {
      this.currentPage = 1
      this.pageSize = 20
      this.setData()
    },
    setData() {
      const length = this.tableData.length
      const startRow = (this.currentPage - 1) * this.pageSize + 1
      let endRow = this.currentPage * this.pageSize
      endRow = (endRow > length) ? length : endRow
      this.pageData = this.tableData.slice(startRow, endRow)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
