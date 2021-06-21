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
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建关联记录
      </el-button>
    </el-form> -->

    <div class="deviceTabs">
      <el-radio-group v-model="currDevice" @change="handleFilter">
        <el-radio-button label="全部" />
        <el-radio-button v-for="item in optionsDevices" :key="item.value" :label="item.label" />
      </el-radio-group>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center">
        <template slot-scope="{row}">
          <span>{{ row.device && row.device.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目" align="center">
        <template slot-scope="{row}">
          <span>{{ row.record && row.record.showname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" :options-pros="optionsPros" :options-devices="optionsDevices" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import { getAllPros } from '@/api/program'
import { getAllDevices } from '@/api/device'
import { fetchList, deleteProdevice } from '@/api/devicepros'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Add from './add.vue'
import Edit from './edit.vue'

export default {
  components: { Pagination, Add, Edit },
  directives: { waves },
  data() {
    return {
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
        device: '',
        deviceId: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      allPrograms: [],
      optionsPros: [],
      currDevice: '全部',
      allDevices: [],
      optionsDevices: []
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
    allDevices: function(newVal) {
      if (newVal.length) {
        this.optionsDevices = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    currDevice: function(newVal) {
      if (newVal !== '全部') {
        this.filterForm.device = newVal
        this.filterForm.deviceId = this.optionsDevices.filter((item, idx, arr) => {
          return item.label === newVal
        })[0].value
      } else {
        this.filterForm.device = ''
        this.filterForm.deviceId = ''
      }
    }
  },
  created() {
    this.getAllPros()
    this.getAllDevices()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items
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
      if (this.filterForm.device !== '') {
        this.listQuery.device = this.filterForm.device
      }
      if (this.filterForm.deviceId !== '') {
        this.listQuery.deviceId = this.filterForm.deviceId
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
        this.delDevicepro(id, idx)
      })
    },
    delDevicepro(id, idx) {
      deleteProdevice({ id: id }).then(response => {
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
        this.allPrograms = data.items
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    getAllDevices() {
      getAllDevices().then(data => {
        this.allDevices = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped>
.deviceTabs {
  margin-bottom: 10px;
}
</style>
