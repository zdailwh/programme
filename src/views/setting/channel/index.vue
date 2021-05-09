<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" placeholder="频道名称" style="width:120px" />
      </el-form-item>
      <el-form-item prop="index">
        <el-input v-model="filterForm.index" placeholder="播出编号" style="width:120px" />
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
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建频道
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="table-expand" label-width="100px">
            <!-- SDI -->
            <template v-if="row.type === 1">
              <el-form-item label="码率卡序号">
                <span>{{ row.cardno }}</span>
              </el-form-item>
              <el-form-item label="端口号">
                <span>{{ row.portno }}</span>
              </el-form-item>
              <el-form-item label="输出帧率">
                <span>{{ row.fps }}</span>
              </el-form-item>
              <el-form-item label="输出声道">
                <span>{{ row.audiotype }}</span>
              </el-form-item>
            </template>
            <!-- UDP -->
            <template v-if="row.type === 0">
              <el-form-item label="网络ID">
                <span>{{ row.networkid }}</span>
              </el-form-item>
              <el-form-item label="传送流ID">
                <span>{{ row.tsid }}</span>
              </el-form-item>
              <el-form-item label="业务ID">
                <span>{{ row.serviceid }}</span>
              </el-form-item>
              <el-form-item label="PMT PID">
                <span>{{ row.pmtpid }}</span>
              </el-form-item>
              <el-form-item label="VIDEO PID">
                <span>{{ row.videopid }}</span>
              </el-form-item>
              <el-form-item label="组播地址">
                <span>{{ row.outurl }}</span>
              </el-form-item>
              <el-form-item label="组播端口">
                <span>{{ row.outport }}</span>
              </el-form-item>
              <el-form-item label="输出码率">
                <span>{{ row.bitrate }}</span>
              </el-form-item>
              <el-form-item label="输出网卡IP地址">
                <span>{{ row.localaddr }}</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="垫片路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.defaultts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="EPG路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.epgurl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分辨率宽" align="center">
        <template slot-scope="{row}">
          <span>{{ row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分辨率高" align="center">
        <template slot-scope="{row}">
          <span>{{ row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.videores }}</span>
        </template>
      </el-table-column>
      <el-table-column label="播出类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button v-if="row.status !== 1" type="text" size="medium" @click="actived(row.id, $index)">启用</el-button>
          <el-button v-if="row.status !== 2" type="text" size="medium" @click="inactived(row.id, $index)">停止</el-button>
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-popover
            placement="top"
            width="170"
            trigger="hover"
          >
            <p>确定要删除此频道吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="delChannel(row.id, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="medium" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import { fetchList, actived, inactived, deleteChannel } from '@/api/channel'
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
        name: '',
        port: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleEdit: false
    }
  },
  created() {
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
      if (this.filterForm.name !== '') {
        this.listQuery.name = this.filterForm.name
      }
      if (this.filterForm.port !== '') {
        this.listQuery.port = this.filterForm.port
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    actived(id, idx) {
      actived({ id: id }).then(data => {
        this.$message({
          message: '启用成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    inactived(id, idx) {
      inactived({ id: id }).then(data => {
        this.$message({
          message: '停止成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    delChannel(id, idx) {
      deleteChannel({ id: id }).then(response => {
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
      this.editItem = item
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible(params) {
      this.dialogVisibleEdit = params
    }
  }
}
</script>
