<template>
  <div class="app-container">
    <!-- <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="schedule" align="center">
        <template slot-scope="{row}">
          <span>{{ row.schedule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cycle" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cycle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="execute" align="center">
        <template slot-scope="{row}">
          <span>{{ row.execute }}</span>
        </template>
      </el-table-column>
      <el-table-column label="success" align="center">
        <template slot-scope="{row}">
          <span>{{ row.success }}</span>
        </template>
      </el-table-column>
      <el-table-column label="exception" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.exception }}</span>
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
        <template slot-scope="{row}">
          <router-link :to="{name: 'TaskJobList', query: { thread_id: row.id }}">
            <el-button type="text" size="medium">jobs</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList } from '@/api/task-thread'
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
      }
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
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    }
  }
}
</script>
