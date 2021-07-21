<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="userId">
        <el-select v-model="filterForm.userId" placeholder="用户">
          <el-option label="全部用户" value="" />
          <el-option v-for="item in optionsUsers" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="roleId">
        <el-select v-model="filterForm.roleId" placeholder="角色">
          <el-option label="全部角色" value="" />
          <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
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

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user && row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role && row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isVisitor" label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" :options-users="optionsUsers" :options-roles="optionsRoles" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" :options-roles="optionsRoles" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getAllUsers } from '@/api/admin'
import { getAllRoles } from '@/api/myrole'
import { fetchList, deleteRoleUser } from '@/api/roleuser'
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
        userId: '',
        roleId: ''
      },
      dialogVisibleAdd: false,
      allUsers: [],
      optionsUsers: [],
      allRoles: [],
      optionsRoles: [],
      editItem: {},
      editIndex: '',
      dialogVisibleEdit: false
    }
  },
  watch: {
    allUsers: function(newVal) {
      if (newVal.length) {
        this.optionsUsers = newVal.map((item, idx, arr) => {
          return {
            label: item.username,
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
    this.getAllUsers()
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
      if (this.filterForm.userId !== '') {
        this.listQuery.userId = this.filterForm.userId
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
    editHandle(item, idx) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible(params) {
      this.dialogVisibleEdit = params
    },
    getAllUsers() {
      getAllUsers().then(data => {
        this.allUsers = data.items || []
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
        this.delRoleUser(id, idx)
      })
    },
    delRoleUser(id, idx) {
      deleteRoleUser({ id: id }).then(response => {
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
