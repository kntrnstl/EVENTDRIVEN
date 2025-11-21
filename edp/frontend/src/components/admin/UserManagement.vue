<template>
  <div class="user-management">

    <h2 class="title">User Management 👥</h2>

    <!-- SEARCH + FILTER -->
    <div class="controls">
      <input 
        v-model="search" 
        type="text" 
        placeholder="Search username or email..."
        class="search-input"
      />

      <select v-model="filterRole" class="filter-select">
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div class="user-table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th width="170">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td :class="user.status">{{ user.status }}</td>

            <td>
              <button class="btn edit" @click="openEdit(user)">Edit</button>
              <button class="btn delete" @click="openDelete(user)">Delete</button>
            </td>
          </tr>
        </tbody>

      </table>
    </div>

    <!-- PAGINATION -->
    <div class="pagination">
      <button 
        class="btn-page" 
        :disabled="page===1" 
        @click="page--"
      >
        Prev
      </button>

      <span>Page {{ page }} of {{ totalPages }}</span>

      <button 
        class="btn-page" 
        :disabled="page===totalPages" 
        @click="page++"
      >
        Next
      </button>
    </div>

    <!-- EDIT MODAL -->
    <div class="modal" v-if="showEdit">
      <div class="modal-content">
        <h3>Edit User</h3>

        <label>Username</label>
        <input v-model="editForm.username" type="text" />

        <label>Email</label>
        <input v-model="editForm.email" type="email" />

        <label>Role</label>
        <select v-model="editForm.role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label>Status</label>
        <select v-model="editForm.status">
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>

        <label>New Password (optional)</label>
        <input v-model="editForm.password" type="password" placeholder="Leave blank to keep existing" />

        <div class="modal-actions">
          <button @click="updateUser" class="btn save">Save</button>
          <button @click="closeEdit" class="btn cancel">Cancel</button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRMATION -->
    <div class="modal" v-if="showDelete">
      <div class="modal-content">
        <h3>Delete User?</h3>
        <p>Are you sure you want to delete <strong>{{ deleteUserData.username }}</strong>?</p>

        <div class="modal-actions">
          <button @click="confirmDelete" class="btn delete">Delete</button>
          <button @click="closeDelete" class="btn cancel">Cancel</button>
        </div>
      </div>
    </div>

    <!-- NOTIFICATION -->
    <div :class="['notif', notif.type, { show: notif.show }]">
      {{ notif.message }}
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserManagement",

  data() {
    return {
      users: [],

      search: "",
      filterRole: "",
      page: 1,
      perPage: 10,

      showEdit: false,
      showDelete: false,

      editForm: {
        id: null,
        username: "",
        email: "",
        role: "",
        status: "",
        password: ""
      },

      deleteUserData: {},

      notif: {
        show: false,
        message: "",
        type: ""
      }
    };
  },

  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        const matchesSearch =
          u.username.toLowerCase().includes(this.search.toLowerCase()) ||
          u.email.toLowerCase().includes(this.search.toLowerCase());

        const matchesRole =
          this.filterRole === "" || u.role === this.filterRole;

        return matchesSearch && matchesRole;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.perPage);
    },

    paginatedUsers() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredUsers.slice(start, start + this.perPage);
    }
  },

  mounted() {
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      const res = await axios.get("http://localhost:3000/api/users");
      this.users = res.data;
    },

    openEdit(user) {
      this.editForm = { ...user, password: "" };
      this.showEdit = true;
    },

    closeEdit() {
      this.showEdit = false;
    },

    async updateUser() {
      try {
        await axios.put(
          `http://localhost:3000/api/users/${this.editForm.id}`,
          this.editForm
        );

        this.showNotif("User updated successfully!", "success");
        this.showEdit = false;
        this.loadUsers();
      } catch (err) {
        this.showNotif("Update failed!", "error");
      }
    },

    openDelete(user) {
      this.deleteUserData = user;
      this.showDelete = true;
    },

    closeDelete() {
      this.showDelete = false;
    },

    async confirmDelete() {
      try {
        await axios.delete(
          `http://localhost:3000/api/users/${this.deleteUserData.id}`
        );

        this.showNotif("User deleted!", "success");
        this.showDelete = false;
        this.loadUsers();
      } catch (err) {
        this.showNotif("Delete failed!", "error");
      }
    },

    showNotif(message, type) {
      this.notif = { show: true, message, type };
      setTimeout(() => (this.notif.show = false), 2500);
    }
  }
};
</script>


<style scoped>
.user-management {
  padding: 20px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

.user-table-container {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 14px;
  overflow: hidden;
}

.user-table th,
.user-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background: #f6f6f6;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-size: 13px;
}

.btn.edit {
  background: #0275d8;
  color: white;
}

.btn.delete {
  background: #d9534f;
  color: white;
}

.btn.cancel {
  background: #777;
  color: white;
}

.btn.save {
  background: #5cb85c;
  color: white;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}

.modal-content {
  background: white;
  padding: 25px;
  width: 350px;
  border-radius: 12px;
}

.modal-content input,
.modal-content select {
  width: 100%;
  margin-bottom: 12px;
  padding: 7px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

/* Notification */
.notif {
  position: fixed;
  bottom: 25px;
  right: -300px;
  background: #444;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  transition: 0.3s;
}

.notif.show {
  right: 25px;
}

.notif.error {
  background: #d9534f;
}

.notif.success {
  background: #5cb85c;
}
</style>
