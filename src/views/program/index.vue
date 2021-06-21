<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="channelId">
        <el-select v-model="filterForm.channelId" placeholder="所属频道">
          <el-option label="全部频道" value="" />
          <el-option v-for="item in optionsChannels" :key="item.value" :label="item.label" :value="item.value" />
          <el-option label="与频道无关联" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item prop="deviceId">
        <el-select v-model="filterForm.deviceId" placeholder="所属设备">
          <el-option label="全部设备" value="" />
          <el-option v-for="item in optionsDevices" :key="item.value" :label="item.label" :value="item.value" />
          <el-option label="与设备无关联" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item prop="showname">
        <el-input v-model="filterForm.showname" placeholder="节目名称" style="width:120px" />
      </el-form-item>
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
      <el-form-item prop="status">
        <el-select v-model="filterForm.status" placeholder="状态">
          <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!selectedItems.length" @click="handleDelSelectedPros">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="danger" icon="el-icon-share" :disabled="!selectedItems.length" @click="dialogVisibleDevice = true">批量关联设备</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="danger" icon="el-icon-share" :disabled="!selectedItems.length" @click="dialogVisibleChannel = true">批量关联频道</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item v-if="row.realpath" label="节目路径：">
              <span>{{ row.realpath }}</span>
            </el-form-item>
            <el-form-item v-if="row.size" label="文件大小：">
              <span>{{ row.size }}</span>
            </el-form-item>
            <el-form-item v-if="row.ext" label="扩展名：">
              <span>{{ row.ext }}</span>
            </el-form-item>
            <el-form-item v-if="row.md5" label="MD5值：">
              <span>{{ row.md5 }}</span>
            </el-form-item>
            <el-form-item v-if="row.info" label="简介：">
              <span>{{ row.info }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.showname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.duration | formateSeconds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="码率" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.coderate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.finishtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.statusstr | statusFilter">
            {{ row.statusstr }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button>
          <el-button type="text" size="medium" @click="editDeviceProHandle(row, $index)">节目设备关联</el-button>
          <el-button type="text" size="medium" @click="editChannelProHandle(row, $index)">节目频道关联</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Edit :edit-item="editItem" :options-channels="optionsChannels" :options-devices="optionsDevices" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
    <EditDevicePro :edit-item="editItem" :options-devices="optionsDevices" :dialog-visible-edit-device-pro="dialogVisibleEditDevicePro" @changeEditDeviceProVisible="changeEditDeviceProVisible" @refresh="getList" />
    <EditChannelPro :edit-item="editItem" :options-channels="optionsChannels" :dialog-visible-edit-channel-pro="dialogVisibleEditChannelPro" @changeEditChannelProVisible="changeEditChannelProVisible" @refresh="getList" />

    <el-dialog
      title="批量关联设备"
      :visible.sync="dialogVisibleDevice"
      width="50%"
    >
      <div>
        <el-form ref="deviceForm" label-width="100px">
          <el-form-item prop="deviceid" label="所属设备：">
            <el-select v-model="deviceForm.deviceid" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in optionsDevices" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDevice = false">取 消</el-button>
        <el-button type="primary" @click="handleSelectedContDevice">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量关联频道"
      :visible.sync="dialogVisibleChannel"
      width="50%"
    >
      <div>
        <el-form ref="channelForm" label-width="100px">
          <el-form-item prop="channelid" label="所属频道：">
            <el-select v-model="channelForm.channelid" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in optionsChannels" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleChannel = false">取 消</el-button>
        <el-button type="primary" @click="handleSelectedContChannel">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, deleteProgram } from '@/api/program'
import { getAllChannels } from '@/api/channel'
import { getAllDevices } from '@/api/device'
import { createProdevice } from '@/api/devicepros'
import { createProchn } from '@/api/prochns'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Edit from './edit.vue'
import EditDevicePro from './editDevicePro.vue'
import EditChannelPro from './editChannelPro.vue'

export default {
  components: { Pagination, Edit, EditDevicePro, EditChannelPro },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已创建': 'info',
        '文件待上传': 'warning',
        '文件上传成功': 'success'
      }
      return statusMap[status]
    },
    formateSeconds(second) {
      let secondTime = parseInt(second / 1000)
      // var haomiao = parseInt(second % 1000)
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ''
      if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) // 获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) // 获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) { // 如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) // 获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) // 获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      return result
    }
  },
  data() {
    return {
      allChannels: [],
      optionsChannels: [],
      allDevices: [],
      optionsDevices: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        showname: '',
        channelId: '',
        deviceId: '',
        create_time_range: [],
        update_time_range: [],
        status: ''
      },
      statusArr: [{ label: '已创建', value: 0 }, { label: '文件待上传', value: 1 }, { label: '文件上传成功', value: 2 }],
      editItem: {},
      editIndex: '',
      dialogVisibleEdit: false,
      selectedItems: [],
      dialogVisibleDevice: false,
      dialogVisibleChannel: false,
      deviceForm: {
        deviceid: ''
      },
      channelForm: {
        channelid: ''
      },
      dialogVisibleEditDevicePro: false,
      dialogVisibleEditChannelPro: false
    }
  },
  watch: {
    allChannels: function(newVal) {
      if (newVal.length) {
        this.optionsChannels = newVal.map((item, idx, arr) => {
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
    }
  },
  created() {
    this.getList()
    this.getAllChannels()
    this.getAllDevices()
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
      if (this.filterForm.showname !== '') {
        this.listQuery.showname = this.filterForm.showname
      }
      if (this.filterForm.deviceId !== '') {
        this.listQuery.deviceId = this.filterForm.deviceId
      }
      if (this.filterForm.channelId !== '') {
        this.listQuery.channelId = this.filterForm.channelId
      }
      if (this.filterForm.create_time_range && this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.update_time_range && this.filterForm.update_time_range.length) {
        this.listQuery.update_time_range = this.filterForm.update_time_range
      }
      if (this.filterForm.status !== '') {
        this.listQuery.status = this.filterForm.status
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    delHandler(id, idx) {
      this.$confirm('确定要删除此节目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delProgram(id, idx)
      })
    },
    delProgram(id, idx) {
      deleteProgram({ id: id }).then(response => {
        if (response.fail === 0 && response.total === response.success) {
          this.$message({
            message: response.message || '删除成功！',
            type: 'success'
          })
          this.getList()
        }
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
    },
    editHandle(item, idx) {
      this.editItem = item
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible(params) {
      this.dialogVisibleEdit = params
    },
    handleSelectionChange(val) {
      this.selectedItems = val
    },
    handleDelSelectedPros() {
      this.$confirm(`此操作将删除当前选中的${this.selectedItems.length}个节目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelSelectedPros()
      }).catch(() => {
        console.log('已取消删除')
      })
    },
    doDelSelectedPros() {
      const requestList = this.selectedItems.map(async(listItem, idx, arr) => {
        return new Promise((resolve, reject) => {
          deleteProgram({ id: listItem.id }).then(response => {
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
            message: '批量删除节目执行失败！',
            type: 'error'
          })
        } else {
          this.$message({
            message: '批量删除节目执行成功！',
            type: 'success'
          })
        }
        this.getList()
      })
    },
    handleSelectedContDevice() {
      this.dialogVisibleDevice = false

      const requestList = this.selectedItems.map(async(listItem, idx, arr) => {
        return new Promise((resolve, reject) => {
          createProdevice({ programmeId: listItem.id, deviceId: this.deviceForm.deviceid }).then(response => {
            resolve(idx)
          }).catch(error => {
            reject(error)
          })
        })
      })
      Promise.all(requestList).then(res => {
        if (res.length < this.selectedItems.length) {
          this.$message({
            message: '批量关联设备执行成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '批量关联设备执行成功！',
            type: 'success'
          })
        }
        this.getList()
      })
    },
    handleSelectedContChannel() {
      this.dialogVisibleChannel = false

      const requestList = this.selectedItems.map(async(listItem, idx, arr) => {
        return new Promise((resolve, reject) => {
          createProchn({ programmeId: listItem.id, channelId: this.channelForm.channelid }).then(response => {
            resolve(idx)
          }).catch(error => {
            reject(error)
          })
        })
      })
      Promise.all(requestList).then(res => {
        if (res.length < this.selectedItems.length) {
          this.$message({
            message: '批量关联频道执行成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '批量关联频道执行成功！',
            type: 'success'
          })
        }
        this.getList()
      })
    },
    editDeviceProHandle(item, idx) {
      this.editItem = item
      this.dialogVisibleEditDevicePro = true
    },
    changeEditDeviceProVisible(params) {
      this.dialogVisibleEditDevicePro = params
    },
    editChannelProHandle(item, idx) {
      this.editItem = item
      this.dialogVisibleEditChannelPro = true
    },
    changeEditChannelProVisible(params) {
      this.dialogVisibleEditChannelPro = params
    }
  }
}
</script>
<style scoped>
.channelTabs {
  margin-bottom: 10px;
}
</style>
