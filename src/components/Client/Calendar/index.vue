<template>
  <div class="calendar-wrapper">
    <!-- Animated Background -->
    <div class="calendar-bg">
      <div class="bg-gradient"></div>
      <div class="floating-shapes">
        <span v-for="n in 6" :key="n" class="shape"></span>
      </div>
    </div>

    <div class="calendar-container">
      <!-- Header -->
      <header class="calendar-header">
        <div class="header-left">
          <div class="calendar-icon">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
          <div class="header-info">
            <h1 class="header-title">Lịch công việc</h1>
            <p class="header-subtitle">Quản lý thời gian hiệu quả</p>
          </div>
        </div>
        
        <div class="header-right">
          <router-link to="/dashboard" class="btn-back">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Dashboard</span>
          </router-link>
        </div>
      </header>

      <!-- Controls -->
      <div class="calendar-controls">
        <div class="nav-controls">
          <button class="nav-btn" @click="yearView ? prevYear() : prevMonth()">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          
          <div class="current-period">
            <span class="period-month" v-if="!yearView">{{ monthName }}</span>
            <span class="period-year">{{ currentYear }}</span>
          </div>
          
          <button class="nav-btn" @click="yearView ? nextYear() : nextMonth()">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="view-controls">
          <button 
            class="view-btn" 
            :class="{ active: !yearView }" 
            @click="yearView = false; loadData()"
          >
            <i class="fa-solid fa-calendar"></i>
            <span>Tháng</span>
          </button>
          <button 
            class="view-btn" 
            :class="{ active: yearView }" 
            @click="yearView = true"
          >
            <i class="fa-solid fa-calendar-alt"></i>
            <span>Năm</span>
          </button>
        </div>
        
        <div class="filter-controls">
          <button 
            class="filter-btn" 
            :class="{ active: filterOption === 'Tất cả' }"
            @click="setFilter('Tất cả')"
          >
            Tất cả
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: filterOption === 'Công việc' }"
            @click="setFilter('Công việc')"
          >
            <i class="fa-solid fa-tasks"></i>
            Công việc
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: filterOption === 'Nhắc nhở' }"
            @click="setFilter('Nhắc nhở')"
          >
            <i class="fa-solid fa-bell"></i>
            Nhắc nhở
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-card stat-tasks">
          <div class="stat-icon">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTasks }}</span>
            <span class="stat-label">Công việc tháng này</span>
          </div>
        </div>
        <div class="stat-card stat-reminders">
          <div class="stat-icon">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalReminders }}</span>
            <span class="stat-label">Nhắc nhở</span>
          </div>
        </div>
        <div class="stat-card stat-today">
          <div class="stat-icon">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ todayTasks }}</span>
            <span class="stat-label">Việc hôm nay</span>
          </div>
        </div>
        <div class="stat-card stat-upcoming">
          <div class="stat-icon">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ upcomingTasks }}</span>
            <span class="stat-label">Sắp tới</span>
          </div>
        </div>
      </div>

      <!-- Year View -->
      <div v-if="yearView" class="year-view">
        <div 
          v-for="m in 12" 
          :key="m" 
          class="mini-month"
          :class="{ 'current-month': m - 1 === new Date().getMonth() && currentYear === new Date().getFullYear() }"
          @click="openMonth(m - 1)"
        >
          <div class="mini-month-header">
            <span class="mini-month-name">{{ getMonthName(m - 1) }}</span>
          </div>
          
          <div class="mini-calendar">
            <div class="mini-weekdays">
              <span v-for="d in weekDaysShort" :key="d">{{ d }}</span>
            </div>
            <div class="mini-days">
              <div 
                v-for="day in getMiniCalendar(m - 1)" 
                :key="day.key"
                class="mini-day"
                :class="{ 
                  'outside': day.outside, 
                  'has-task': day.hasTask,
                  'has-reminder': day.hasReminder,
                  'is-today': day.isToday
                }"
              >
                {{ day.outside ? '' : day.date.getDate() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-else class="month-view">
        <div class="month-grid">
          <!-- Weekday Headers -->
          <div class="weekday-header" v-for="d in weekDays" :key="d">
            {{ d }}
          </div>
          
          <!-- Day Cells -->
          <div 
            v-for="(day, index) in daysInCalendar" 
            :key="index"
            class="day-cell"
            :class="{ 
              'outside-month': day.outside,
              'is-today': day.isToday,
              'has-events': day.tasks.length > 0 || day.reminders.length > 0
            }"
          >
            <div class="day-header">
              <span class="day-number" :class="{ 'today-badge': day.isToday }">
                {{ day.date.getDate() }}
              </span>
              <div class="day-indicators">
                <span v-if="day.tasks.length > 0" class="indicator task-indicator">
                  {{ day.tasks.length }}
                </span>
                <span v-if="day.reminders.length > 0" class="indicator reminder-indicator">
                  <i class="fa-solid fa-bell"></i>
                </span>
              </div>
            </div>
            
            <div class="day-events" v-if="!day.outside">
              <div 
                v-for="task in day.tasks.slice(0, 3)" 
                :key="task.id"
                class="event task-event"
                :class="getPriorityClass(task.priority)"
              >
                <span class="event-dot"></span>
                <span class="event-title">{{ task.title }}</span>
              </div>
              
              <div 
                v-for="reminder in day.reminders.slice(0, 2)" 
                :key="reminder.id"
                class="event reminder-event"
              >
                <i class="fa-solid fa-bell"></i>
                <span class="event-title">{{ reminder.title }}</span>
              </div>
              
              <div v-if="day.tasks.length + day.reminders.length > 5" class="more-events">
                +{{ day.tasks.length + day.reminders.length - 5 }} khác
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Events Sidebar -->
      <div class="today-sidebar" v-if="!yearView">
        <div class="sidebar-header">
          <h3><i class="fa-solid fa-calendar-check"></i> Hôm nay</h3>
          <span class="today-date">{{ formattedToday }}</span>
        </div>
        
        <div class="sidebar-content">
          <div v-if="todayEvents.length === 0" class="no-events">
            <i class="fa-solid fa-coffee"></i>
            <p>Không có sự kiện nào hôm nay</p>
          </div>
          
          <div v-else class="today-events">
            <div 
              v-for="event in todayEvents" 
              :key="event.id"
              class="today-event"
              :class="event.type"
            >
              <div class="event-time">
                <i :class="event.type === 'task' ? 'fa-solid fa-circle-check' : 'fa-solid fa-bell'"></i>
              </div>
              <div class="event-details">
                <span class="event-name">{{ event.title }}</span>
                <span class="event-meta" v-if="event.type === 'task'">
                  {{ event.status || 'Chưa hoàn thành' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseAxios from "../../../core/baseAxios";

export default {
  name: "CalendarPage",

  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      yearView: false,
      tasks: [],
      reminders: [],
      weekDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
      weekDaysShort: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      filterOption: "Tất cả",
    };
  },

  computed: {
    monthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString("vi-VN", {
        month: "long",
      });
    },

    formattedToday() {
      return new Date().toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    },

    totalTasks() {
      return this.tasks.length;
    },

    totalReminders() {
      let count = 0;
      this.tasks.forEach(t => {
        if (t.reminders) count += t.reminders.length;
      });
      return count;
    },

    todayTasks() {
      const today = new Date().toISOString().split('T')[0];
      return this.tasks.filter(t => t.start_date === today).length;
    },

    upcomingTasks() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.tasks.filter(t => new Date(t.start_date) > today).length;
    },

    todayEvents() {
      const today = new Date().toISOString().split('T')[0];
      const events = [];
      
      this.tasks.filter(t => t.start_date === today).forEach(t => {
        events.push({ ...t, type: 'task' });
        if (t.reminders) {
          t.reminders.forEach(r => {
            events.push({ ...r, type: 'reminder' });
          });
        }
      });
      
      return events;
    },

    daysInCalendar() {
      if (this.yearView) return [];

      const days = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const startIdx = (firstDay.getDay() + 6) % 7;

      // Previous month days
      const prevMonthLast = new Date(this.currentYear, this.currentMonth, 0);
      for (let i = startIdx - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLast.getDate() - i);
        days.push({ 
          outside: true, 
          date, 
          tasks: [], 
          reminders: [],
          isToday: false
        });
      }

      // Current month days
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(this.currentYear, this.currentMonth, d);
        const dateStr = date.toISOString().split("T")[0];

        const dayTasks = this.tasks.filter(t => t.start_date === dateStr);
        let dayReminders = [];
        dayTasks.forEach(t => {
          if (t.reminders) {
            dayReminders.push(...t.reminders);
          }
        });

        days.push({
          outside: false,
          date,
          tasks: dayTasks,
          reminders: dayReminders,
          isToday: date.getTime() === today.getTime()
        });
      }

      // Next month days
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({ 
          outside: true, 
          date, 
          tasks: [], 
          reminders: [],
          isToday: false
        });
      }

      return days;
    },
  },

  methods: {
    setFilter(option) {
      this.filterOption = option;
      this.loadData();
    },

    async loadData() {
      try {
        const month = this.currentMonth + 1;
        const res = await baseAxios.get(`/calendar/events?month=${month}&year=${this.currentYear}`);
        this.tasks = res.data.tasks || [];
        this.reminders = res.data.reminders || [];
      } catch (error) {
        console.error('Error loading calendar data:', error);
      }
    },

    prevYear() {
      this.currentYear--;
    },

    nextYear() {
      this.currentYear++;
    },

    prevMonth() {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.loadData();
    },

    nextMonth() {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.loadData();
    },

    getMonthName(m) {
      return new Date(this.currentYear, m).toLocaleString("vi-VN", { month: "long" });
    },

    openMonth(m) {
      this.currentMonth = m;
      this.yearView = false;
      this.loadData();
    },

    getMiniCalendar(month) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const first = new Date(this.currentYear, month, 1);
      const last = new Date(this.currentYear, month + 1, 0);
      const start = (first.getDay() + 6) % 7;
      const total = last.getDate();

      const boxes = Array(42).fill(0).map((_, i) => ({
        outside: true,
        date: new Date(0),
        hasTask: false,
        hasReminder: false,
        isToday: false,
        key: i + '-' + month,
      }));

      for (let d = 1; d <= total; d++) {
        const date = new Date(this.currentYear, month, d);
        const dateStr = date.toISOString().split("T")[0];

        const dayTasks = this.tasks.filter(t => t.start_date === dateStr);
        let dayReminders = [];
        dayTasks.forEach(t => {
          if (t.reminders) dayReminders.push(...t.reminders);
        });

        const idx = start + d - 1;
        boxes[idx] = {
          outside: false,
          date,
          hasTask: dayTasks.length > 0,
          hasReminder: dayReminders.length > 0,
          isToday: date.getTime() === today.getTime(),
          key: dateStr,
        };
      }

      return boxes;
    },

    getPriorityClass(priority) {
      const priorityMap = {
        'high': 'priority-high',
        'medium': 'priority-medium',
        'low': 'priority-low',
        'Cao': 'priority-high',
        'Trung bình': 'priority-medium',
        'Thấp': 'priority-low'
      };
      return priorityMap[priority] || 'priority-default';
    }
  },

  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
/* ==================== WRAPPER & BACKGROUND ==================== */
.calendar-wrapper {
  min-height: 100vh;
  background: #f0f4f8;
  position: relative;
  overflow: hidden;
}

.calendar-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 150%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05));
  border-radius: 50%;
  filter: blur(60px);
}

.floating-shapes .shape {
  position: absolute;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 50%;
  animation: float 15s infinite ease-in-out;
}

.shape:nth-child(1) { width: 100px; height: 100px; top: 10%; left: 5%; animation-delay: 0s; }
.shape:nth-child(2) { width: 60px; height: 60px; top: 30%; right: 10%; animation-delay: 2s; }
.shape:nth-child(3) { width: 80px; height: 80px; bottom: 20%; left: 15%; animation-delay: 4s; }
.shape:nth-child(4) { width: 40px; height: 40px; top: 60%; left: 50%; animation-delay: 1s; }
.shape:nth-child(5) { width: 70px; height: 70px; bottom: 30%; right: 20%; animation-delay: 3s; }
.shape:nth-child(6) { width: 50px; height: 50px; top: 80%; left: 80%; animation-delay: 5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

/* ==================== CONTAINER ==================== */
.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  position: relative;
  z-index: 1;
}

/* ==================== HEADER ==================== */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.calendar-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}

.header-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-back:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-5px);
}

/* ==================== CONTROLS ==================== */
.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease 0.1s backwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-btn {
  width: 45px;
  height: 45px;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.current-period {
  text-align: center;
  min-width: 200px;
}

.period-month {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  text-transform: capitalize;
}

.period-year {
  font-size: 16px;
  color: #64748b;
}

.view-controls {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
}

/* ==================== STATS ROW ==================== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: slideUp 0.5s ease backwards;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.15s; }
.stat-card:nth-child(3) { animation-delay: 0.2s; }
.stat-card:nth-child(4) { animation-delay: 0.25s; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-tasks .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-reminders .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-today .stat-icon { background: linear-gradient(135deg, #10b981, #059669); }
.stat-upcoming .stat-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* ==================== YEAR VIEW ==================== */
.year-view {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  animation: fadeIn 0.5s ease;
}

.mini-month {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.mini-month:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.mini-month.current-month {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea10, #764ba210);
}

.mini-month-header {
  text-align: center;
  margin-bottom: 15px;
}

.mini-month-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  text-transform: capitalize;
}

.mini-calendar {
  font-size: 12px;
}

.mini-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 8px;
}

.mini-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.mini-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  position: relative;
}

.mini-day.outside {
  color: transparent;
}

.mini-day.is-today {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
}

.mini-day.has-task::after {
  content: '';
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  background: #3b82f6;
  border-radius: 50%;
}

.mini-day.has-reminder::before {
  content: '';
  position: absolute;
  top: 2px;
  width: 4px;
  height: 4px;
  background: #f59e0b;
  border-radius: 50%;
}

/* ==================== MONTH VIEW ==================== */
.month-view {
  display: flex;
  gap: 30px;
  animation: fadeIn 0.5s ease;
}

.month-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.weekday-header {
  text-align: center;
  padding: 15px;
  font-weight: 700;
  color: #667eea;
  font-size: 14px;
  border-bottom: 2px solid #f1f5f9;
}

.day-cell {
  min-height: 120px;
  background: #fafafa;
  border-radius: 12px;
  padding: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.day-cell:hover {
  background: #f1f5f9;
  transform: scale(1.02);
}

.day-cell.outside-month {
  opacity: 0.4;
  background: transparent;
}

.day-cell.is-today {
  background: linear-gradient(135deg, #667eea10, #764ba210);
  border: 2px solid #667eea;
}

.day-cell.has-events {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.day-number {
  font-weight: 700;
  color: #374151;
  font-size: 15px;
}

.day-number.today-badge {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-indicators {
  display: flex;
  gap: 4px;
}

.indicator {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
}

.task-indicator {
  background: #dbeafe;
  color: #3b82f6;
}

.reminder-indicator {
  background: #fef3c7;
  color: #f59e0b;
  font-size: 10px;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  transition: all 0.2s ease;
}

.event:hover {
  transform: translateX(3px);
}

.task-event {
  background: #eff6ff;
  color: #1e40af;
}

.task-event .event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
}

.task-event.priority-high { background: #fee2e2; color: #991b1b; }
.task-event.priority-high .event-dot { background: #ef4444; }

.task-event.priority-medium { background: #fef3c7; color: #92400e; }
.task-event.priority-medium .event-dot { background: #f59e0b; }

.task-event.priority-low { background: #d1fae5; color: #065f46; }
.task-event.priority-low .event-dot { background: #10b981; }

.reminder-event {
  background: #fef3c7;
  color: #92400e;
}

.event-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.more-events {
  font-size: 11px;
  color: #667eea;
  font-weight: 600;
  padding: 4px 8px;
  cursor: pointer;
}

/* ==================== TODAY SIDEBAR ==================== */
.today-sidebar {
  width: 300px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 30px;
}

.sidebar-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f5f9;
}

.sidebar-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.sidebar-header h3 i {
  color: #667eea;
}

.today-date {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-top: 5px;
  text-transform: capitalize;
}

.no-events {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.no-events i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.no-events p {
  margin: 0;
  font-size: 14px;
}

.today-events {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.today-event {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.today-event:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

.today-event.task .event-time {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.today-event.reminder .event-time {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.event-time {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.event-details {
  flex: 1;
}

.event-name {
  display: block;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 14px;
}

.event-meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1200px) {
  .year-view {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .month-view {
    flex-direction: column;
  }
  
  .today-sidebar {
    width: 100%;
    position: relative;
    top: 0;
  }
}

@media (max-width: 992px) {
  .calendar-controls {
    flex-direction: column;
    gap: 20px;
  }
  
  .year-view {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 15px;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .year-view {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .day-cell {
    min-height: 80px;
    padding: 6px;
  }
  
  .weekday-header {
    padding: 10px 5px;
    font-size: 12px;
  }
}
</style>
