<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.create_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="filterForm.username" placeholder="用户名" style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <el-form-item v-if="!isVisitor">
        <el-button v-if="currUser.role && currUser.role.level > 3" class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">创建用户</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 831px;">
      <!-- <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="用户名" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员标识" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.isadmin | isadminFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活跃度" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.activity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="success">{{ row.statusstr }}</el-tag>
          <el-tag v-else-if="row.status === 2" type="danger">{{ row.statusstr }}</el-tag>
          <el-tag v-else type="info">{{ row.statusstr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="!isVisitor" label="操作" align="center" width="250">
        <template slot-scope="{row, $index}">
          <el-button v-if="currUser.role && currUser.role.level > 3 && row.status !== 1" type="text" size="medium" @click="actived(row.id, $index)">激活</el-button>
          <el-button v-if="currUser.role && currUser.role.level > 3 && row.status !== 2" type="text" size="medium" @click="inactived(row.id, $index)">禁用</el-button>
          <el-button v-if="currUser.role && currUser.role.level > 3 && row.status === 2" type="text" size="medium" @click="resetPwdHandle(row, $index)">重置密码</el-button>
          <el-button v-if="currUser.role && currUser.role.level > 3 && row.status === 2" type="text" size="medium" @click="resetRoleHandle(row, $index)">修改角色</el-button>
          <el-popover
            v-if="currUser.role && currUser.role.level > 3 && row.status === 2"
            placement="top"
            width="170"
            trigger="hover"
          >
            <p>确定要删除此用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="delUser(row.id, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="medium" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" :options-roles="optionsRoles" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <ResetPwd :edit-item="editItem" :dialog-visible-reset-pwd="dialogVisibleResetPwd" @changeResetPwdVisible="changeResetPwdVisible" />
    <ResetRole :edit-item="editItem" :options-roles="optionsRoles" :dialog-visible-reset-role="dialogVisibleResetRole" @changeResetRoleVisible="changeResetRoleVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { fetchList, actived, inactived, deleteUser } from '@/api/admin'
import { getAllRoles } from '@/api/myrole'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Add from './add.vue'
import ResetPwd from './resetPwd.vue'
import ResetRole from './resetRole.vue'
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination, Add, ResetPwd, ResetRole },
  directives: { waves },
  filters: {
    isadminFilter(val) {
      const typeObj = {
        2: '普通',
        3: '操作员',
        4: '管理员',
        5: '超级管理员'
      }
      return typeObj[val]
    }
  },
  data() {
    return {
      isVisitor: (Cookies.get('Programme-isVisitor') && JSON.parse(Cookies.get('Programme-isVisitor'))) || false,
      currUser: JSON.parse(getToken()),
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        create_time_range: [],
        username: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleResetPwd: false,
      dialogVisibleResetRole: false,
      allRoles: [],
      optionsRoles: []
    }
  },
  watch: {
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
    this.getList()
    this.getAllRoles()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items.filter(item => {
          if (this.currUser.role && this.currUser.role.level === 3) {
            // 操作员
            return this.currUser.id === item.id
          } else if (this.currUser.role && this.currUser.role.level === 4) {
            // 管理员
            return true
          } else if (this.currUser.role && this.currUser.role.level === 5) {
            // 超级管理员
            return true
          }
        })
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
      if (this.filterForm.create_time_range && this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.username !== '') {
        this.listQuery.username = this.filterForm.username
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
          message: '激活成功！',
          type: 'success'
        })
        this.getList()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    inactived(id, idx) {
      inactived({ id: id }).then(data => {
        this.$message({
          message: '禁用成功！',
          type: 'success'
        })
        this.getList()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    delUser(id, idx) {
      deleteUser({ id: id }).then(response => {
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
    },
    changeAddVisible(params) {
      this.dialogVisibleAdd = params
    },
    resetPwdHandle(item, idx) {
      this.editItem = item
      this.dialogVisibleResetPwd = true
    },
    changeResetPwdVisible(params) {
      this.dialogVisibleResetPwd = params
    },
    resetRoleHandle(item, idx) {
      this.editItem = item
      this.dialogVisibleResetRole = true
    },
    changeResetRoleVisible(params) {
      this.dialogVisibleResetRole = params
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
    }
  }
}
</script>
