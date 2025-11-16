<template>
  <div class="category-container">

    <!-- Notification -->
    <div 
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      {{ notification.message }}
    </div>

    <!-- Confirmation Modal -->
    <div v-if="confirmDelete.show" class="confirm-overlay">
      <div class="confirm-box">
        <p>Are you sure you want to delete <strong>{{ confirmDelete.name }}</strong>?</p>
        <div class="confirm-actions">
          <button @click="confirmDeleteCategory" class="confirm-btn">Yes</button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <h2>Categories</h2>

    <!-- Add Category Card -->
    <div class="add-card">
      <input 
        v-model="newCategory"
        type="text"
        placeholder="Enter new category"
        class="input"
      />
      <button class="btn-add" @click="addCategory">Add</button>
    </div>

    <!-- Category List -->
    <div class="category-list">
      <div 
        class="category-card"
        v-for="cat in categories"
        :key="cat.id"
      >
        <input 
          v-model="cat.name"
          @blur="updateCategory(cat)"
          class="category-input"
        />
        <button class="btn-delete" @click="prepareDelete(cat.id, cat.name)">
          ✕
        </button>
      </div>

      <p v-if="categories.length === 0" class="empty">
        No categories found
      </p>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      newCategory: "",
      notification: {
        show: false,
        type: "",
        message: ""
      },
      confirmDelete: {
        show: false,
        id: null,
        name: ""
      }
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    showNotif(type, msg) {
      this.notification.type = type;
      this.notification.message = msg;
      this.notification.show = true;

      setTimeout(() => (this.notification.show = false), 2500);
    },

    async fetchCategories() {
      try {
        const res = await axios.get("/api/admin/categories", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        this.categories = res.data;
      } catch (err) {
        this.showNotif("error", "Failed to load categories");
      }
    },

    async addCategory() {
      if (!this.newCategory.trim()) {
        this.showNotif("error", "Category name cannot be empty");
        return;
      }

      try {
        await axios.post(
          "/api/admin/categories",
          { name: this.newCategory },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );

        this.showNotif("success", "Category added");
        this.newCategory = "";
        this.fetchCategories();
      } catch (err) {
        this.showNotif("error", "Failed to add category");
      }
    },

    async updateCategory(cat) {
      if (!cat.name.trim()) {
        this.showNotif("error", "Category cannot be empty");
        return;
      }

      try {
        await axios.put(
          `/api/admin/categories/${cat.id}`,
          { name: cat.name },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );

        this.showNotif("success", "Updated successfully");
      } catch (err) {
        this.showNotif("error", "Update failed");
      }
    },

    prepareDelete(id, name) {
      this.confirmDelete.id = id;
      this.confirmDelete.name = name;
      this.confirmDelete.show = true;
    },

    async confirmDeleteCategory() {
      try {
        await axios.delete(`/api/admin/categories/${this.confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        this.showNotif("success", "Category deleted");
        this.fetchCategories();
      } catch {
        this.showNotif("error", "Delete failed");
      } finally {
        this.confirmDelete.show = false;
      }
    },

    cancelDelete() {
      this.confirmDelete.show = false;
    }
  }
};
</script>

<style scoped>
/* Existing styles remain */
.category-container { max-width: 900px; margin:auto; padding:25px; background:white; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.1); font-family:"Inter",sans-serif; }
h2 { text-align:center; font-weight:700; color:#0a3c2b; margin-bottom:25px; }
.add-card { display:flex; gap:10px; margin-bottom:25px; }
.input { flex:1; padding:12px; border-radius:10px; border:1px solid #d1e8df; outline:none; font-size:15px; }
.input:focus { border-color:#1a5e46; }
.btn-add { background:linear-gradient(135deg,#0cb67a,#066b42); color:white; padding:11px 20px; border:none; border-radius:10px; cursor:pointer; font-weight:600; transition:0.3s; }
.btn-add:hover { transform:translateY(-2px); box-shadow:0 5px 12px rgba(0,150,90,0.3); }
.category-list { display:flex; flex-direction:column; gap:12px; }
.category-card { display:flex; align-items:center; padding:12px 15px; background:#f8fdfb; border:1px solid #d6eee4; border-radius:12px; justify-content:space-between; }
.category-input { flex:1; padding:10px; border:none; background:transparent; font-size:15px; outline:none; }
.category-input:focus { border-bottom:1px solid #0a3c2b; }
.btn-delete { background:#ff5252; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:13px; cursor:pointer; transition:0.3s; }
.btn-delete:hover { background:#d62828; }
.empty { text-align:center; font-style:italic; padding-top:10px; color:#777; }
.custom-notif { position:fixed; top:-80px; left:50%; transform:translateX(-50%); padding:14px 23px; border-radius:12px; font-weight:600; color:white; opacity:0; pointer-events:none; transition:all 0.35s ease; z-index:9999; }
.custom-notif.show { top:20px; opacity:1; }
.custom-notif.success { background:linear-gradient(135deg,#00b061,#00773d); }
.custom-notif.error { background:linear-gradient(135deg,#d62828,#9b1d1d); }

/* Confirmation Modal */
.confirm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:10000; }
.confirm-box { background:white; padding:25px 30px; border-radius:20px; max-width:400px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.25); }
.confirm-box p { margin-bottom:20px; font-weight:600; color:#071815; }
.confirm-actions { display:flex; justify-content:space-around; }
.confirm-btn { padding:10px 20px; border-radius:12px; border:none; background:linear-gradient(135deg,#00b061,#00773d); color:#fff; font-weight:600; cursor:pointer; transition:all 0.3s ease; }
.confirm-btn:hover { transform:translateY(-2px); box-shadow:0 6px 15px rgba(0,255,150,0.3); }
.cancel-btn { padding:10px 20px; border-radius:12px; border:none; background:linear-gradient(135deg,#d62828,#9b1d1d); color:#fff; font-weight:600; cursor:pointer; transition:all 0.3s ease; }
.cancel-btn:hover { transform:translateY(-2px); box-shadow:0 6px 15px rgba(255,0,0,0.3); }

.category-card {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #f8fdfb;
  border: 1px solid #d6eee4;
  border-radius: 12px;
  justify-content: space-between;
  transition: all 0.3s ease; /* added */
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #1a5e46;
  background: #f0fff6;
}
.input {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cce8dd;
  outline: none;
  font-size: 15px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #0a3c2b;
  box-shadow: 0 0 8px rgba(0, 180, 97, 0.3);
}

.btn-add {
  background: linear-gradient(135deg, #00d375, #00773d);
  padding: 11px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 20px rgba(0, 180, 97, 0.3);
}
.btn-delete {
  background: #ff6b6b;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 5px 15px rgba(255, 80, 80, 0.3);
}
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  opacity: 0;
  animation: fadeIn 0.25s forwards;
}

.confirm-box {
  background: white;
  padding: 25px 30px;
  border-radius: 20px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  transform: scale(0.95);
  animation: scaleUp 0.25s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
@keyframes scaleUp {
  to { transform: scale(1); }
}
.category-container {
  background: linear-gradient(145deg, #fdfdfd, #f0fff6);
}

</style>
