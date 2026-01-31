<template>
  <div class="global-search">
    <div class="search-input-wrapper" :class="{ focused: isFocused }">
      <i class="bi bi-search search-icon"></i>
      <input type="text" 
             class="form-control search-input"
             placeholder="Tìm kiếm công việc, dự án, người dùng..."
             v-model="query"
             @input="debounceSearch"
             @focus="onFocus"
             @blur="onBlur"
             @keydown.esc="closeResults">
      <span v-if="loading" class="spinner-border spinner-border-sm loading-spinner"></span>
      <button v-else-if="query" class="btn-clear" @click="clearSearch">
        <i class="bi bi-x"></i>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <div class="search-results" v-if="showResults && (results.tasks?.length || results.projects?.length || results.users?.length)">
      <!-- Tasks -->
      <div v-if="results.tasks?.length" class="result-section">
        <div class="section-header">
          <i class="bi bi-list-task me-2"></i>Công việc
        </div>
        <router-link v-for="task in results.tasks" :key="'task-'+task.id"
                     :to="task.url" class="result-item" @click="clearSearch">
          <div class="result-icon bg-primary text-white">
            <i class="bi bi-check2-square"></i>
          </div>
          <div class="result-content">
            <div class="result-title">{{ task.title }}</div>
            <div class="result-subtitle">
              <span class="badge" :class="getStatusBadge(task.status)">{{ task.status }}</span>
              {{ task.subtitle }}
            </div>
          </div>
        </router-link>
      </div>

      <!-- Projects -->
      <div v-if="results.projects?.length" class="result-section">
        <div class="section-header">
          <i class="bi bi-folder me-2"></i>Dự án
        </div>
        <router-link v-for="project in results.projects" :key="'project-'+project.id"
                     :to="project.url" class="result-item" @click="clearSearch">
          <div class="result-icon bg-success text-white">
            <i class="bi bi-folder-fill"></i>
          </div>
          <div class="result-content">
            <div class="result-title">{{ project.title }}</div>
            <div class="result-subtitle">{{ project.subtitle }}</div>
          </div>
        </router-link>
      </div>

      <!-- Users -->
      <div v-if="results.users?.length" class="result-section">
        <div class="section-header">
          <i class="bi bi-people me-2"></i>Người dùng
        </div>
        <div v-for="user in results.users" :key="'user-'+user.id" class="result-item">
          <div class="result-icon bg-info text-white">
            <img v-if="user.avatar" :src="user.avatar" class="rounded-circle" 
                 style="width: 100%; height: 100%; object-fit: cover;">
            <i v-else class="bi bi-person-fill"></i>
          </div>
          <div class="result-content">
            <div class="result-title">{{ user.title }}</div>
            <div class="result-subtitle">{{ user.subtitle }}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="search-footer">
        <span class="text-muted">{{ totalResults }} kết quả</span>
        <span class="text-muted">Nhấn ESC để đóng</span>
      </div>
    </div>

    <!-- No Results -->
    <div class="search-results" v-else-if="showResults && query.length >= 2 && !loading">
      <div class="no-results">
        <i class="bi bi-search fs-1 d-block mb-2"></i>
        Không tìm thấy kết quả cho "{{ query }}"
      </div>
    </div>
  </div>
</template>

<script>
import searchService from '@/services/searchService'

export default {
  name: 'GlobalSearch',
  data() {
    return {
      query: '',
      loading: false,
      isFocused: false,
      showResults: false,
      results: {
        tasks: [],
        projects: [],
        users: []
      },
      totalResults: 0,
      searchTimeout: null
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    debounceSearch() {
      clearTimeout(this.searchTimeout)
      
      if (this.query.length < 2) {
        this.results = { tasks: [], projects: [], users: [] }
        this.showResults = false
        return
      }
      
      this.searchTimeout = setTimeout(() => {
        this.search()
      }, 300)
    },
    async search() {
      try {
        this.loading = true
        const response = await searchService.globalSearch(this.query)
        
        if (response.data.success) {
          this.results = response.data.data
          this.totalResults = response.data.total
          this.showResults = true
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        this.loading = false
      }
    },
    onFocus() {
      this.isFocused = true
      if (this.query.length >= 2 && this.totalResults > 0) {
        this.showResults = true
      }
    },
    onBlur() {
      this.isFocused = false
    },
    closeResults() {
      this.showResults = false
    },
    clearSearch() {
      this.query = ''
      this.results = { tasks: [], projects: [], users: [] }
      this.showResults = false
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showResults = false
      }
    },
    getStatusBadge(status) {
      const badges = {
        'Hoàn thành': 'bg-success',
        'completed': 'bg-success',
        'Đang làm': 'bg-primary',
        'in_progress': 'bg-primary',
        'Cần làm': 'bg-warning',
        'pending': 'bg-warning',
        'Chưa bắt đầu': 'bg-secondary'
      }
      return badges[status] || 'bg-secondary'
    }
  }
}
</script>

<style scoped>
.global-search {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  z-index: 1;
}

.search-input {
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 25px;
  background-color: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.search-input:focus {
  background-color: white;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.search-input-wrapper.focused .search-icon {
  color: #0d6efd;
}

.loading-spinner,
.btn-clear {
  position: absolute;
  right: 12px;
}

.btn-clear {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.btn-clear:hover {
  color: #dc3545;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-height: 480px;
  overflow-y: auto;
  z-index: 1000;
}

.result-section {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.result-section:last-of-type {
  border-bottom: none;
}

.section-header {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  overflow: hidden;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle .badge {
  font-size: 10px;
  margin-right: 8px;
}

.search-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.no-results {
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;
}

/* Scrollbar */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>
