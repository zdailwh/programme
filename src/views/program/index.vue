<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" placeholder="节目名称" style="width:120px" />
      </el-form-item>
      <el-form-item prop="createdate">
        <el-date-picker
          v-model="filterForm.createdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="导入时间"
        />
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
      <el-radio-group v-model="radio1">
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label" />
      </el-radio-group>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属频道" align="center">
        <template slot-scope="{row}">
          <span>{{ row.channel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="码率" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bitrate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 0" type="success">{{ row.statusstr }}</el-tag>
          <el-tag v-else type="info">{{ row.statusstr }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="delProgram(row.id, $index)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, deleteProgram } from '@/api/program'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      radio1: '频道1',
      options: [{ value: '11', label: '频道1' }, { value: '12', label: '频道2' }, { value: '13', label: '频道3' }, { value: '14', label: '频道4' }, { value: '15', label: '频道5' }],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        createdate: '',
        create_time_range: [],
        update_time_range: [],
        status: ''
      },
      statusArr: [{ label: '有效', value: 0 }, { label: '无效', value: 1 }]
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
      }).catch(error => {
        this.listLoading = false
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.createdate !== '') {
        this.listQuery.createdate = this.filterForm.createdate
      }
      if (this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.update_time_range.length) {
        this.listQuery.update_time_range = this.filterForm.update_time_range
      }
      if (this.filterForm.status !== '') {
        this.listQuery.status = this.filterForm.status
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    delProgram(id, idx) {
      deleteProgram({ id: id }).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
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
.channelTabs {
  margin-bottom: 10px;
}
</style>
