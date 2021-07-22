<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="roleId">
        <el-select v-model="filterForm.roleId" placeholder="角色">
          <el-option label="全部角色" value="" />
          <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="permissionId">
        <el-select v-model="filterForm.permissionId" placeholder="权限">
          <el-option label="全部权限" value="" />
          <el-option v-for="item in optionsPermissions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-button v-if="!isVisitor" class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建关联记录
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 601px;">
      <el-table-column label="角色名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.role && row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.permission && row.permission.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isVisitor" label="操作" align="center" width="150">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" :options-permissions="optionsPermissions" :options-roles="optionsRoles" @changeAddVisible="changeAddVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getAllPermissions } from '@/api/mypermission'
import { getAllRoles } from '@/api/myrole'
import { fetchList, deleteRolePerm } from '@/api/roleperm'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Add from './add.vue'

export default {
  components: { Pagination, Add },
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
        permissionId: '',
        roleId: ''
      },
      dialogVisibleAdd: false,
      allPermissions: [],
      optionsPermissions: [],
      allRoles: [],
      optionsRoles: []
    }
  },
  watch: {
    allPermissions: function(newVal) {
      if (newVal.length) {
        this.optionsPermissions = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    allRoles: function(newVal) {
      if (newVal.length) {
        this.optionsRoles = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    }
  },
  created() {
    this.getAllPermissions()
    this.getAllRoles()
    this.getList()
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
      if (this.filterForm.permissionId !== '') {
        this.listQuery.permissionId = this.filterForm.permissionId
      }
      if (this.filterForm.roleId !== '') {
        this.listQuery.roleId = this.filterForm.roleId
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    changeAddVisible(params) {
      this.dialogVisibleAdd = params
    },
    getAllPermissions() {
      getAllPermissions().then(data => {
        this.allPermissions = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    getAllRoles() {
      getAllRoles().then(data => {
        this.allRoles = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    delHandler(id, idx) {
      this.$confirm('确定要删除此关联吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRolePerm(id, idx)
      })
    },
    delRolePerm(id, idx) {
      deleteRolePerm({ id: id }).then(response => {
        this.$message({
          message: response.message || '删除成功！',
          type: 'success'
        })
        this.getList()
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
