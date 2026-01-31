<template>
  <div class="user-management">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Quản lý người dùng</h1>
        <p class="text-muted mb-0">Quản lý tài khoản và phân quyền người dùng</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-lg me-2"></i>Thêm người dùng
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 bg-light">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <p class="text-muted mb-1">Tổng số</p>
                <h4 class="mb-0">{{ userStats.total_users || 0 }}</h4>
              </div>
              <div class="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                <i class="bi bi-people"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <p class="text-muted mb-1">Đang hoạt động</p>
                <h4 class="mb-0 text-success">{{ userStats.active_users || 0 }}</h4>
              </div>
              <div class="icon-box bg-success bg-opacity-10 text-success rounded-circle p-3">
                <i class="bi bi-check-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <p class="text-muted mb-1">Admin</p>
                <h4 class="mb-0 text-danger">{{ userStats.by_role?.admin || 0 }}</h4>
              </div>
              <div class="icon-box bg-danger bg-opacity-10 text-danger rounded-circle p-3">
                <i class="bi bi-shield-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <p class="text-muted mb-1">Manager</p>
                <h4 class="mb-0 text-info">{{ userStats.by_role?.manager || 0 }}</h4>
              </div>
              <div class="icon-box bg-info bg-opacity-10 text-info rounded-circle p-3">
                <i class="bi bi-person-badge"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" placeholder="Tìm kiếm theo tên, email..."
                     v-model="filters.search" @input="debounceSearch">
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filters.role" @change="loadUsers">
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filters.is_active" @change="loadUsers">
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã vô hiệu</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="text-center py-4">
                  <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                  Đang tải...
                </td>
              </tr>
              <tr v-else-if="!users.length">
                <td colspan="6" class="text-center py-4 text-muted">
                  Không có người dùng nào
                </td>
              </tr>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <div class="d-flex align-items-center">
                    <img v-if="user.avatar" :src="user.avatar" class="rounded-circle me-3"
                         width="40" height="40" style="object-fit: cover;">
                    <div v-else class="avatar-placeholder rounded-circle bg-secondary text-white me-3 d-flex align-items-center justify-content-center"
                         style="width: 40px; height: 40px;">
                      {{ getInitials(user.ho_va_ten) }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ user.ho_va_ten }}</div>
                      <small class="text-muted">{{ user.job || 'Chưa cập nhật' }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    {{ getRoleName(user.role) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="user.is_active ? 'bg-success' : 'bg-secondary'">
                    {{ user.is_active ? 'Hoạt động' : 'Vô hiệu' }}
                  </span>
                </td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td class="text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="openEditModal(user)"
                            title="Chỉnh sửa">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" @click="toggleStatus(user)"
                            :title="user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'">
                      <i class="bi" :class="user.is_active ? 'bi-lock' : 'bi-unlock'"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(user)"
                            title="Xóa">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav v-if="pagination.last_page > 1" class="mt-4">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(pagination.current_page - 1)">
                <i class="bi bi-chevron-left"></i>
              </a>
            </li>
            <li class="page-item" v-for="page in visiblePages" :key="page"
                :class="{ active: page === pagination.current_page }">
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
              <a class="page-link" href="#" @click.prevent="goToPage(pagination.current_page + 1)">
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" ref="userModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="form.ho_va_ten" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="form.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu {{ isEditing ? '(để trống nếu không đổi)' : '' }}
                  <span v-if="!isEditing" class="text-danger">*</span>
                </label>
                <input type="password" class="form-control" v-model="form.password"
                       :required="!isEditing">
              </div>
              <div class="mb-3">
                <label class="form-label">Vai trò <span class="text-danger">*</span></label>
                <select class="form-select" v-model="form.role" required>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input type="text" class="form-control" v-model="form.so_dien_thoai">
              </div>
              <div class="mb-3">
                <label class="form-label">Công việc</label>
                <input type="text" class="form-control" v-model="form.job">
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="form.address">
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="form.is_active" id="isActive">
                <label class="form-check-label" for="isActive">Kích hoạt tài khoản</label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="saveUser" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '@/services/adminService'
import { Modal } from 'bootstrap'

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      userStats: {},
      loading: false,
      saving: false,
      filters: {
        search: '',
        role: '',
        is_active: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
      },
      form: {
        ho_va_ten: '',
        email: '',
        password: '',
        role: 'user',
        so_dien_thoai: '',
        job: '',
        address: '',
        is_active: true
      },
      isEditing: false,
      editingId: null,
      modal: null,
      searchTimeout: null
    }
  },
  computed: {
    visiblePages() {
      const pages = []
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      
      let start = Math.max(1, current - 2)
      let end = Math.min(last, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.userModal)
    this.loadUsers()
    this.loadStatistics()
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        }
        
        const response = await adminService.getUsers(params)
        if (response.data.success) {
          this.users = response.data.data
          this.pagination = response.data.pagination
        }
      } catch (error) {
        console.error('Error loading users:', error)
        this.$toast?.error?.('Không thể tải danh sách người dùng')
      } finally {
        this.loading = false
      }
    },
    async loadStatistics() {
      try {
        const response = await adminService.getUserStatistics()
        if (response.data.success) {
          this.userStats = response.data.data
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    },
    debounceSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1
        this.loadUsers()
      }, 300)
    },
    resetFilters() {
      this.filters = { search: '', role: '', is_active: '' }
      this.pagination.current_page = 1
      this.loadUsers()
    },
    goToPage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.pagination.current_page = page
      this.loadUsers()
    },
    openCreateModal() {
      this.isEditing = false
      this.editingId = null
      this.form = {
        ho_va_ten: '',
        email: '',
        password: '',
        role: 'user',
        so_dien_thoai: '',
        job: '',
        address: '',
        is_active: true
      }
      this.modal.show()
    },
    openEditModal(user) {
      this.isEditing = true
      this.editingId = user.id
      this.form = {
        ho_va_ten: user.ho_va_ten,
        email: user.email,
        password: '',
        role: user.role || 'user',
        so_dien_thoai: user.so_dien_thoai || '',
        job: user.job || '',
        address: user.address || '',
        is_active: user.is_active ?? true
      }
      this.modal.show()
    },
    async saveUser() {
      try {
        this.saving = true
        const data = { ...this.form }
        if (!data.password) delete data.password
        
        let response
        if (this.isEditing) {
          response = await adminService.updateUser(this.editingId, data)
        } else {
          response = await adminService.createUser(data)
        }
        
        if (response.data.success) {
          this.$toast?.success?.(response.data.message || 'Thành công')
          this.modal.hide()
          this.loadUsers()
          this.loadStatistics()
        }
      } catch (error) {
        console.error('Error saving user:', error)
        const message = error.response?.data?.message || 'Có lỗi xảy ra'
        this.$toast?.error?.(message)
      } finally {
        this.saving = false
      }
    },
    async toggleStatus(user) {
      if (!confirm(`Bạn có chắc muốn ${user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản này?`)) return
      
      try {
        const response = await adminService.toggleUserStatus(user.id)
        if (response.data.success) {
          this.$toast?.success?.(response.data.message)
          this.loadUsers()
          this.loadStatistics()
        }
      } catch (error) {
        console.error('Error toggling status:', error)
        const message = error.response?.data?.message || 'Có lỗi xảy ra'
        this.$toast?.error?.(message)
      }
    },
    async confirmDelete(user) {
      if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.ho_va_ten}"?`)) return
      
      try {
        const response = await adminService.deleteUser(user.id)
        if (response.data.success) {
          this.$toast?.success?.(response.data.message)
          this.loadUsers()
          this.loadStatistics()
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        const message = error.response?.data?.message || 'Có lỗi xảy ra'
        this.$toast?.error?.(message)
      }
    },
    getInitials(name) {
      if (!name) return '?'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    getRoleName(role) {
      const names = { admin: 'Admin', manager: 'Manager', user: 'User' }
      return names[role] || role
    },
    getRoleBadgeClass(role) {
      const classes = { admin: 'bg-danger', manager: 'bg-primary', user: 'bg-secondary' }
      return classes[role] || 'bg-secondary'
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.avatar-placeholder {
  font-size: 14px;
  font-weight: bold;
}
</style>
