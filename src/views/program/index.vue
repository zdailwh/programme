<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
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
    </el-form>

    <div class="channelTabs">
      <el-radio-group v-model="currChannel" @change="handleFilter">
        <el-radio-button label="全部" />
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label" />
      </el-radio-group>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
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
      <el-table-column label="所属频道" align="center">
        <template slot-scope="{row}">
          <span>{{ row.chnnames | tojoin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.duration }}</span>
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
          <el-popover
            placement="top"
            width="170"
            trigger="hover"
          >
            <p>确定要删除此节目吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="delProgram(row.id, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="medium" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Edit :edit-item="editItem" :all-channels="allChannels" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />

  </div>
</template>

<script>
import { fetchList, deleteProgram } from '@/api/program'
import { getAllChannels } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Edit from './edit.vue'

export default {
  components: { Pagination, Edit },
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
    tojoin(val) {
      return val.join('#')
    }
  },
  data() {
    return {
      currChannel: '全部',
      options: [],
      allChannels: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        showname: '',
        channel: '',
        channelId: '',
        create_time_range: [],
        update_time_range: [],
        status: ''
      },
      statusArr: [{ label: '已创建', value: 0 }, { label: '文件待上传', value: 1 }, { label: '文件上传成功', value: 2 }],
      editItem: {},
      editIndex: '',
      dialogVisibleEdit: false
    }
  },
  watch: {
    allChannels: function(newVal) {
      if (newVal.length) {
        this.options = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    currChannel: function(newVal) {
      if (newVal !== '全部') {
        this.filterForm.channel = newVal
        this.filterForm.channelId = this.options.filter((item, idx, arr) => {
          return item.label === newVal
        })[0].value
      } else {
        this.filterForm.channel = ''
        this.filterForm.channelId = ''
      }
    }
  },
  created() {
    this.getList()
    this.getAllChannels()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        if (data.items) {
          data.items.map((item, idx, arr) => {
            item.chnids = item.chnids.split('#').map((it) => {
              return parseInt(it)
            })
            item.chnnames = item.chnnames.split('#')
          })
          this.list = data.items
        } else {
          this.list = []
        }
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
      if (this.filterForm.channel !== '') {
        this.listQuery.channel = this.filterForm.channel
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
    delProgram(id, idx) {
      deleteProgram({ id: id }).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items
      })
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
<style scoped>
.channelTabs {
  margin-bottom: 10px;
}
</style>
