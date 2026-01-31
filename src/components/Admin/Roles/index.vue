<template>
  <div class="role-management">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Quản lý vai trò & quyền</h1>
        <p class="text-muted mb-0">Thiết lập vai trò và phân quyền cho hệ thống</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-lg me-2"></i>Thêm vai trò
      </button>
    </div>

    <div class="row">
      <!-- Roles List -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-person-badge me-2"></i>Danh sách vai trò</h5>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary"></div>
              </div>
              <a v-for="role in roles" :key="role.id"
                 href="#" class="list-group-item list-group-item-action"
                 :class="{ active: selectedRole?.id === role.id }"
                 @click.prevent="selectRole(role)">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">{{ role.name }}</h6>
                    <small class="text-muted">{{ role.description || 'Không có mô tả' }}</small>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-secondary">{{ role.users_count || 0 }} users</span>
                    <span class="badge bg-primary ms-1">{{ role.permissions_count || 0 }} quyền</span>
                  </div>
                </div>
              </a>
              <div v-if="!loading && !roles.length" class="text-center py-4 text-muted">
                Chưa có vai trò nào
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Panel -->
      <div class="col-md-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-shield-check me-2"></i>
              {{ selectedRole ? `Quyền của: ${selectedRole.name}` : 'Chọn vai trò để xem quyền' }}
            </h5>
            <div v-if="selectedRole" class="btn-group">
              <button class="btn btn-sm btn-outline-primary" @click="openEditModal(selectedRole)">
                <i class="bi bi-pencil me-1"></i>Sửa
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(selectedRole)"
                      :disabled="selectedRole.users_count > 0">
                <i class="bi bi-trash me-1"></i>Xóa
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="!selectedRole" class="text-center py-5 text-muted">
              <i class="bi bi-arrow-left fs-1 d-block mb-3"></i>
              Chọn một vai trò từ danh sách bên trái để xem và chỉnh sửa quyền
            </div>
            
            <div v-else-if="loadingPermissions" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            
            <div v-else>
              <!-- Quick Actions -->
              <div class="mb-4">
                <button class="btn btn-sm btn-outline-success me-2" @click="selectAll">
                  <i class="bi bi-check-all me-1"></i>Chọn tất cả
                </button>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="deselectAll">
                  <i class="bi bi-x-lg me-1"></i>Bỏ chọn tất cả
                </button>
                <button class="btn btn-sm btn-primary" @click="savePermissions" :disabled="savingPermissions">
                  <span v-if="savingPermissions" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else class="bi bi-save me-1"></i>Lưu thay đổi
                </button>
              </div>

              <!-- Permissions by Group -->
              <div class="accordion" id="permissionsAccordion">
                <div class="accordion-item" v-for="(perms, group) in groupedPermissions" :key="group">
                  <h2 class="accordion-header">
                    <button class="accordion-button" type="button"
                            :data-bs-toggle="'collapse'" :data-bs-target="`#collapse-${group}`">
                      <i class="bi bi-folder me-2"></i>
                      {{ getGroupName(group) }}
                      <span class="badge bg-primary ms-2">
                        {{ getSelectedCount(perms) }}/{{ perms.length }}
                      </span>
                    </button>
                  </h2>
                  <div :id="`collapse-${group}`" class="accordion-collapse collapse show">
                    <div class="accordion-body">
                      <div class="row">
                        <div class="col-md-6" v-for="perm in perms" :key="perm.id">
                          <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   :id="`perm-${perm.id}`"
                                   :value="perm.id"
                                   v-model="selectedPermissions">
                            <label class="form-check-label" :for="`perm-${perm.id}`">
                              <strong>{{ perm.display_name }}</strong>
                              <br>
                              <small class="text-muted">{{ perm.name }}</small>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="roleModal" tabindex="-1" ref="roleModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRole">
              <div class="mb-3">
                <label class="form-label">Tên vai trò <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="form.name" required
                       placeholder="VD: admin, manager, editor">
              </div>
              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea class="form-control" v-model="form.description" rows="3"
                          placeholder="Mô tả ngắn về vai trò này"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="saveRole" :disabled="saving">
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
  name: 'RoleManagement',
  data() {
    return {
      roles: [],
      allPermissions: [],
      groupedPermissions: {},
      selectedRole: null,
      selectedPermissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      savingPermissions: false,
      form: {
        name: '',
        description: ''
      },
      isEditing: false,
      editingId: null,
      modal: null
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.roleModal)
    this.loadRoles()
    this.loadAllPermissions()
  },
  methods: {
    async loadRoles() {
      try {
        this.loading = true
        const response = await adminService.getRoles()
        if (response.data.success) {
          this.roles = response.data.data
        }
      } catch (error) {
        console.error('Error loading roles:', error)
        this.$toast?.error?.('Không thể tải danh sách vai trò')
      } finally {
        this.loading = false
      }
    },
    async loadAllPermissions() {
      try {
        const response = await adminService.getGroupedPermissions()
        if (response.data.success) {
          this.groupedPermissions = response.data.data
          // Flatten for reference
          this.allPermissions = Object.values(this.groupedPermissions).flat()
        }
      } catch (error) {
        console.error('Error loading permissions:', error)
      }
    },
    async selectRole(role) {
      this.selectedRole = role
      this.loadingPermissions = true
      
      try {
        const response = await adminService.getRole(role.id)
        if (response.data.success) {
          this.selectedRole = response.data.data
          this.selectedPermissions = this.selectedRole.permissions?.map(p => p.id) || []
        }
      } catch (error) {
        console.error('Error loading role details:', error)
      } finally {
        this.loadingPermissions = false
      }
    },
    openCreateModal() {
      this.isEditing = false
      this.editingId = null
      this.form = { name: '', description: '' }
      this.modal.show()
    },
    openEditModal(role) {
      this.isEditing = true
      this.editingId = role.id
      this.form = {
        name: role.name,
        description: role.description || ''
      }
      this.modal.show()
    },
    async saveRole() {
      try {
        this.saving = true
        let response
        
        if (this.isEditing) {
          response = await adminService.updateRole(this.editingId, this.form)
        } else {
          response = await adminService.createRole(this.form)
        }
        
        if (response.data.success) {
          this.$toast?.success?.(response.data.message || 'Thành công')
          this.modal.hide()
          this.loadRoles()
          if (this.selectedRole?.id === this.editingId) {
            this.selectRole(response.data.data)
          }
        }
      } catch (error) {
        console.error('Error saving role:', error)
        const message = error.response?.data?.message || 'Có lỗi xảy ra'
        this.$toast?.error?.(message)
      } finally {
        this.saving = false
      }
    },
    async savePermissions() {
      if (!this.selectedRole) return
      
      try {
        this.savingPermissions = true
        const response = await adminService.updateRolePermissions(
          this.selectedRole.id,
          this.selectedPermissions
        )
        
        if (response.data.success) {
          this.$toast?.success?.('Đã cập nhật quyền')
          this.loadRoles()
        }
      } catch (error) {
        console.error('Error saving permissions:', error)
        this.$toast?.error?.('Không thể cập nhật quyền')
      } finally {
        this.savingPermissions = false
      }
    },
    async confirmDelete(role) {
      if (role.users_count > 0) {
        this.$toast?.warning?.('Không thể xóa vai trò đang có người dùng')
        return
      }
      
      if (!confirm(`Bạn có chắc muốn xóa vai trò "${role.name}"?`)) return
      
      try {
        const response = await adminService.deleteRole(role.id)
        if (response.data.success) {
          this.$toast?.success?.(response.data.message)
          this.loadRoles()
          if (this.selectedRole?.id === role.id) {
            this.selectedRole = null
            this.selectedPermissions = []
          }
        }
      } catch (error) {
        console.error('Error deleting role:', error)
        const message = error.response?.data?.message || 'Có lỗi xảy ra'
        this.$toast?.error?.(message)
      }
    },
    selectAll() {
      this.selectedPermissions = this.allPermissions.map(p => p.id)
    },
    deselectAll() {
      this.selectedPermissions = []
    },
    getGroupName(group) {
      const names = {
        tasks: 'Công việc',
        projects: 'Dự án',
        users: 'Người dùng',
        roles: 'Vai trò',
        tags: 'Tags',
        comments: 'Bình luận',
        dashboard: 'Dashboard',
        system: 'Hệ thống'
      }
      return names[group] || group
    },
    getSelectedCount(perms) {
      return perms.filter(p => this.selectedPermissions.includes(p.id)).length
    }
  }
}
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.list-group-item.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.list-group-item.active .text-muted {
  color: rgba(255, 255, 255, 0.75) !important;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
}
</style>
