<template>
  <div class="app-container">
    <!-- <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.create_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
        />
      </el-form-item>
      <el-form-item prop="update_time_range">
        <el-date-picker
          v-model="filterForm.update_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="更新开始日期"
          end-placeholder="更新结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <el-button v-if="!isVisitor" class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建关联记录
      </el-button>
    </el-form> -->

    <div class="channelTabs">
      <el-radio-group v-model="currChannel" @change="handleFilter">
        <el-radio-button v-for="item in optionsChannels" :key="item.value" :label="item.label" />
        <el-radio-button label="全部" />
      </el-radio-group>
    </div>

    <el-form class="filter-form">
      <el-form-item v-if="!isVisitor">
        <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!selectedItems.length" @click="handleDelSelected">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 641px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <!-- <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="频道" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.channel && row.channel.showname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.record && row.record.showname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应急类型" align="center" width="150">
        <template slot-scope="{row}">
          <el-tag v-if="row.emertag === 0" type="info">{{ row.emertagstr }}</el-tag>
          <el-tag v-else-if="row.emertag === 1" type="warning">{{ row.emertagstr }}</el-tag>
          <el-tag v-else-if="row.emertag === 2" type="warning">{{ row.emertagstr }}</el-tag>
          <el-tag v-else-if="row.emertag === 3" type="danger">{{ row.emertagstr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="!isVisitor" label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="emergency(row, $index)">设为应急切播节目</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" :options-pros="optionsPros" :options-channels="optionsChannels" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getAllPros } from '@/api/program'
import { getAllChannels } from '@/api/channel'
import { fetchList, deleteProchn, emergency } from '@/api/prochns'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Add from './add.vue'
import Edit from './edit.vue'

export default {
  components: { Pagination, Add, Edit },
  directives: { waves },
  data() {
    return {
      isVisitor: (Cookies.get('Programme-isVisitor') && JSON.parse(Cookies.get('Programme-isVisitor'))) || false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        create_time_range: [],
        update_time_range: [],
        channel: '',
        channelId: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      allPrograms: [],
      optionsPros: [],
      currChannel: '全部',
      allChannels: [],
      optionsChannels: [],
      selectedItems: []
    }
  },
  watch: {
    allPrograms: function(newVal) {
      if (newVal.length) {
        this.optionsPros = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    allChannels: function(newVal) {
      if (newVal.length) {
        this.optionsChannels = newVal.map((item, idx, arr) => {
          return {
            label: item.showname,
            value: item.id
          }
        })
      }
    },
    optionsChannels: function(newVal) {
      if (newVal.length) {
        this.currChannel = newVal[0].label
        this.filterForm.channel = newVal[0].label
        this.filterForm.channelId = newVal[0].value
        this.handleFilter()
      }
    },
    currChannel: function(newVal) {
      if (newVal !== '全部') {
        this.filterForm.channel = newVal
        this.filterForm.channelId = this.optionsChannels.filter((item, idx, arr) => {
          return item.label === newVal
        })[0].value
      } else {
        this.filterForm.channel = ''
        this.filterForm.channelId = ''
      }
    }
  },
  created() {
    this.getAllPros()
    this.getAllChannels()
    // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items || []
        this.total = data.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.create_time_range && this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.update_time_range && this.filterForm.update_time_range.length) {
        this.listQuery.update_time_range = this.filterForm.update_time_range
      }
      if (this.filterForm.channel !== '') {
        this.listQuery.channel = this.filterForm.channel
      }
      if (this.filterForm.channelId !== '') {
        this.listQuery.channelId = this.filterForm.channelId
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    delHandler(id, idx) {
      this.$confirm('确定要删除此记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delProchn(id, idx)
      })
    },
    delProchn(id, idx) {
      deleteProchn({ id: id }).then(response => {
        if (response.fail === 0 && response.total === response.success) {
          this.$message({
            message: response.message || '删除成功！',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    changeAddVisible(params) {
      this.dialogVisibleAdd = params
    },
    editHandle(item, idx) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible(params) {
      this.dialogVisibleEdit = params
    },
    getAllPros() {
      getAllPros().then(data => {
        this.allPrograms = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    handleSelectionChange(val) {
      this.selectedItems = val
    },
    handleDelSelected() {
      this.$confirm(`此操作将删除当前选中的${this.selectedItems.length}条记录, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelSelected()
      }).catch(() => {
        console.log('已取消删除')
      })
    },
    doDelSelected() {
      const requestList = this.selectedItems.map(async(listItem, idx, arr) => {
        return new Promise((resolve, reject) => {
          deleteProchn({ id: listItem.id }).then(response => {
            if (response.fail === 0 && response.total === response.success) {
              resolve(idx)
            } else {
              reject(idx)
            }
          }).catch(error => {
            reject(error)
          })
        })
      })
      Promise.all(requestList).then(res => {
        if (res.length < this.selectedItems.length) {
          this.$message({
            message: '批量删除频道节目关联执行失败！',
            type: 'error'
          })
        } else {
          this.$message({
            message: '批量删除频道节目关联执行成功！',
            type: 'success'
          })
        }
        this.getList()
      })
    },
    emergency(id, idx) {
      emergency({ id: id }).then(response => {
        if (response.emertag === 1) {
          this.$message({
            message: '执行成功！',
            type: 'success'
          })
          this.getList()
        }
      })
    }
  }
}
</script>
<style scoped>
.channelTabs {
  margin-bottom: 10px;
}
</style>
