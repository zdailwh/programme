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

    <div>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建关联记录
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="table-expand">
            <!-- SDI -->
            <template v-if="row.type === 1">
              <el-form-item label="码率卡序号：">
                <span>{{ row.cardno }}</span>
              </el-form-item>
              <el-form-item label="端口号：">
                <span>{{ row.portno }}</span>
              </el-form-item>
              <el-form-item label="输出帧率：">
                <span>{{ row.fps }}</span>
              </el-form-item>
              <el-form-item label="输出声道：">
                <span>{{ row.audiotype }}</span>
              </el-form-item>
            </template>
            <!-- UDP -->
            <template v-if="row.type === 0">
              <el-form-item label="网络ID：">
                <span>{{ row.networkid }}</span>
              </el-form-item>
              <el-form-item label="传送流ID：">
                <span>{{ row.tsid }}</span>
              </el-form-item>
              <el-form-item label="业务ID：">
                <span>{{ row.serviceid }}</span>
              </el-form-item>
              <el-form-item label="PMT PID：">
                <span>{{ row.pmtpid }}</span>
              </el-form-item>
              <el-form-item label="VIDEO PID：">
                <span>{{ row.videopid }}</span>
              </el-form-item>
              <el-form-item label="组播地址：">
                <span>{{ row.outurl }}</span>
              </el-form-item>
              <el-form-item label="组播端口：">
                <span>{{ row.outport }}</span>
              </el-form-item>
              <el-form-item label="输出码率：">
                <span>{{ row.bitrate | bitrateUnit }}</span>
              </el-form-item>
              <el-form-item label="输出网卡IP地址：">
                <span>{{ row.localaddr }}</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center">
        <template slot-scope="{row}">
          <span>{{ row.device_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道" align="center">
        <template slot-scope="{row}">
          <span>{{ row.channel_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="播出类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type === 0? 'UDP': 'SDI' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动作状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.action === 0" type="danger">停止</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.running === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="运行日志" align="center">
        <template slot-scope="{row}">
          <span>{{ row.log }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <!-- <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" :net-card-arr="netCardArr" :options-chns="optionsChns" :options-devices="optionsDevices" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" :net-card-arr="netCardArr" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import { getAllNetworks, getAllChannels } from '@/api/channel'
import { getAllDevices } from '@/api/device'
import { fetchList, deleteDevicechn } from '@/api/devicechns'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Add from './add.vue'
import Edit from './edit.vue'

export default {
  components: { Pagination, Add, Edit },
  directives: { waves },
  filters: {
    bitrateUnit(val) {
      if (!val || val < 1000) return val + 'B'
      if (val / 1000 < 1000) {
        return (val / 1000) + 'K'
      } else {
        return (val / 1000000) + 'M'
      }
    }
  },
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
      netCardArr: {},
      allChannels: [],
      optionsChns: [],
      currDevice: '全部',
      allDevices: [],
      optionsDevices: []
    }
  },
  watch: {
    allChannels: function(newVal) {
      if (newVal.length) {
        this.optionsChns = newVal.map((item, idx, arr) => {
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
    this.getNetworkList()
    this.getAllChannels()
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
        this.delDevicechn(id, idx)
      })
    },
    delDevicechn(id, idx) {
      deleteDevicechn({ id: id }).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
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
    getNetworkList() {
      getAllNetworks().then((response) => {
        this.netCardArr = response || {}
      }).catch((error) => {
        console.log(error)
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
