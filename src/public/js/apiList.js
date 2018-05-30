/* eslint-disabled */
new Vue({
  el: '#root',
  data() {
    return {
      requestArgs: [],
      responseArgs: [],
      requestHeaders: [],
      modalTitle: '',
      showModal: false,
    }
  },
  methods: {
    handleClick(event) {
      let data = event.target.getAttribute('data')
      data = data ? JSON.parse(data) : undefined
      this.requestArgs = JSON.parse(data.requestArgs)
      this.responseArgs = JSON.parse(data.responseArgs)
      this.requestHeaders = JSON.parse(data.requestHeaders)
      this.modalTitle = data.url.replace(/\$\S*\$/, '')
      this.showModal = true
    },
    handleCancel() {
      this.requestArgs = []
      this.responseArgs = []
      this.requestHeaders = []
      this.modalTitle = ''
      this.showModal = false
    }
  }
})

Vue.component('nested-table', {
  props: ['data'],
  template: `
    <el-table :data='data' size='small' type="expand">
      <template slot-scope="props">
        <template v-if='props.row.children.length > 0'>
          <nested-table :dataSource='props.row.children'></nested-table>
        </template>
      </template>
      <el-table-column label='参数名称' property='name'></el-table-column>
      <el-table-column label='是否必须' property='require'></el-table-column>
      <el-table-column label='数据类型' property='type'></el-table-column>
      <el-table-column label='描述' property='description'></el-table-column>
    </el-table>
  `
})
