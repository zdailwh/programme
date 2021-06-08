<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="id">
        <el-input v-model="filterForm.id" placeholder="ID" />
      </el-form-item>
      <el-form-item prop="thread_id">
        <el-input v-model="filterForm.thread_id" placeholder="thread_id" />
      </el-form-item>
      <el-form-item prop="jobmethod">
        <el-input v-model="filterForm.jobmethod" placeholder="jobmethod" />
      </el-form-item>
      <el-form-item prop="target_id">
        <el-input v-model="filterForm.target_id" placeholder="target_id" />
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

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <div v-if="row.thread">
            <p>thread</p>
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="ID：">
                <span>{{ row.thread.id }}</span>
              </el-form-item>
              <el-form-item label="schedule：">
                <span>{{ row.thread.schedule }}</span>
              </el-form-item>
              <el-form-item label="cycle：">
                <span>{{ row.thread.cycle }}</span>
              </el-form-item>
              <el-form-item label="execute：">
                <span>{{ row.thread.execute }}</span>
              </el-form-item>
              <el-form-item label="success：">
                <span>{{ row.thread.success }}</span>
              </el-form-item>
              <el-form-item label="exception：">
                <span>{{ row.thread.exception }}</span>
              </el-form-item>
              <el-form-item label="flag：">
                <span>{{ row.thread.flag }}</span>
              </el-form-item>
              <el-form-item label="log：">
                <span>{{ row.thread.log }}</span>
              </el-form-item>
              <el-form-item label="状态：">
                <span>{{ row.thread.statusstr }}</span>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="row.target">
            <p>target</p>
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="ID：">
                <span>{{ row.target.id }}</span>
              </el-form-item>
              <el-form-item label="nickname：">
                <span>{{ row.target.nickname }}</span>
              </el-form-item>
              <el-form-item label="headimgurl：">
                <span>{{ row.target.headimgurl }}</span>
              </el-form-item>
              <el-form-item label="sex：">
                <span>{{ row.target.sex }}</span>
              </el-form-item>
              <el-form-item label="city：">
                <span>{{ row.target.city }}</span>
              </el-form-item>
              <el-form-item label="country：">
                <span>{{ row.target.country }}</span>
              </el-form-item>
              <el-form-item label="province：">
                <span>{{ row.target.province }}</span>
              </el-form-item>
              <el-form-item label="language：">
                <span>{{ row.target.language }}</span>
              </el-form-item>
              <el-form-item label="subscribe：">
                <span>{{ row.target.subscribe }}</span>
              </el-form-item>
              <el-form-item label="subscribe_time：">
                <span>{{ row.target.subscribe_time }}</span>
              </el-form-item>
              <el-form-item label="truename：">
                <span>{{ row.target.truename }}</span>
              </el-form-item>
              <el-form-item label="mobile：">
                <span>{{ row.target.mobile }}</span>
              </el-form-item>
              <el-form-item label="email：">
                <span>{{ row.target.email }}</span>
              </el-form-item>
              <el-form-item label="activity：">
                <span>{{ row.target.activity }}</span>
              </el-form-item>
              <el-form-item label="状态：">
                <span>{{ row.target.statusstr }}</span>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="target" align="center">
        <template slot-scope="{row}">
          <span>{{ row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="thread" align="center">
        <template slot-scope="{row}">
          <span>{{ row.thread }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="jobparams" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobparams }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jobmethod" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobmethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="priority" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="schedule" align="center">
        <template slot-scope="{row}">
          <span>{{ row.schedule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="scheduletime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.scheduletime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="duration" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="flag" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.flag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="log" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.log }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button v-if="row.status === 0" type="text" size="medium" @click="jobCancel(row, $index)">取消任务</el-button>
          <el-button v-if="row.status === 0" type="text" size="medium" @click="jobImmediate(row, $index)">立即执行</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, jobCancel, jobImmediate } from '@/api/task-job'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
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
        id: '',
        thread_id: '',
        target_id: '',
        jobmethod: '',
        status: ''
      },
      statusArr: [
        { value: 0, label: '等待' }, { value: 1, label: '执行' }, { value: 2, label: '成功' }, { value: 3, label: '延期' }, { value: 4, label: '失败' }, { value: 5, label: '异常' }, { value: 6, label: '取消' }]
    }
  },
  created() {
    if (this.$route.query.thread_id) {
      this.filterForm.thread_id = this.$route.query.thread_id
    }
    this.handleFilter()
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
      if (this.filterForm.id !== '') {
        this.listQuery.id = this.filterForm.id
      }
      if (this.filterForm.thread_id !== '') {
        this.listQuery.thread_id = this.filterForm.thread_id
      }
      if (this.filterForm.target_id !== '') {
        this.listQuery.target_id = this.filterForm.target_id
      }
      if (this.filterForm.jobmethod !== '') {
        this.listQuery.jobmethod = this.filterForm.jobmethod
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
    jobCancel(id, idx) {
      this.$confirm('确定要取消此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        jobCancel({ id: id }).then(response => {
          this.$message({
            message: '取消任务成功！',
            type: 'success'
          })
          this.handleFilter()
        })
      })
    },
    jobImmediate(id, idx) {
      this.$confirm('确定要执行此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        jobImmediate({ id: id }).then(response => {
          this.$message({
            message: '取消执行成功！',
            type: 'success'
          })
          this.handleFilter()
        })
      })
    }
  }
}
</script>
