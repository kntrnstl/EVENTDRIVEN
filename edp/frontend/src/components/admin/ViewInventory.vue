<template>
  <div class="inventory-container">

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
          <button @click="confirmDeleteProduct" class="confirm-btn">Yes</button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <h2>Inventory</h2>

    <div class="table-wrapper">
      <table class="modern-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Sizes / Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.product_id">
            <td>{{ product.product_id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category_name || 'Uncategorized' }}</td>
            <td>₱{{ parseFloat(product.price).toFixed(2) }}</td>
            <td>
              <ul>
                <li v-for="size in product.sizes" :key="size.id">
                  {{ size.size }} : {{ size.stock }}
                </li>
                <li v-if="product.sizes.length === 0" class="empty">
                  No sizes
                </li>
              </ul>
            </td>
            <td>
              <button class="delete-btn" @click="prepareDelete(product.product_id, product.name)">
                🗑️ Delete
              </button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="6" class="no-data">No products available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      notification: {
        show: false,
        message: '',
        type: ''
      },
      confirmDelete: {
        show: false,
        id: null,
        name: ''
      }
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    showNotification(type, message) {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    async fetchProducts() {
      try {
        const res = await axios.get('/api/admin/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        this.products = res.data.map(p => ({
          ...p,
          category_name: p.category?.name || p.category || 'Uncategorized',
          sizes: p.sizes || []
        }));

      } catch (err) {
        console.error(err);
        this.showNotification('error', 'Failed to fetch products');
      }
    },

    prepareDelete(id, name) {
      this.confirmDelete.id = id;
      this.confirmDelete.name = name;
      this.confirmDelete.show = true;
    },

    async confirmDeleteProduct() {
      try {
        await axios.delete(`/api/admin/products/${this.confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.showNotification('success', 'Product deleted successfully');
        this.fetchProducts();
      } catch (err) {
        console.error(err);
        this.showNotification('error', 'Failed to delete product');
      } finally {
        this.confirmDelete.show = false;
      }
    },

    cancelDelete() {
      this.confirmDelete.show = false;
    }
  }
}
</script>

<style scoped>
/* ---------------- Base Container ---------------- */
.inventory-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(145deg, #ffffff, #f0fff6);
  border-radius: 20px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  color: #071815;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

/* ---------------- Header ---------------- */
h2 {
  color: #0a3c2b;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
  letter-spacing: 0.5px;
}

/* ---------------- Table Wrapper ---------------- */
.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

/* ---------------- Modern Table ---------------- */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

/* ---------------- Table Header ---------------- */
thead th {
  text-align: left;
  padding: 14px 16px;
  background: #f5fdf9;
  color: #0a3c2b;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 2px solid #1a5e46;
  letter-spacing: 0.5px;
}

/* ---------------- Table Body ---------------- */
tbody td {
  padding: 12px 14px;
  color: #071815;
  border-bottom: 1px solid #e0f5ea;
  vertical-align: middle;
  transition: all 0.3s ease;
}

tbody tr {
  border-radius: 12px;
  transition: all 0.3s ease;
}

tbody tr:hover {
  background: #f0fff6;
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0, 180, 97, 0.08);
}

/* ---------------- Sizes List ---------------- */
tbody ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
tbody li {
  font-size: 14px;
  margin-bottom: 4px;
}
tbody li.empty {
  font-style: italic;
  color: #777;
}

/* ---------------- Delete Button ---------------- */
.delete-btn {
  background: linear-gradient(135deg, #ff4d4d, #ff1a1a);
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.delete-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 77, 77, 0.35);
}

/* ---------------- Notifications ---------------- */
.custom-notif {
  position: fixed;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  color: white;
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s ease;
  z-index: 9999;
}
.custom-notif.show {
  top: 20px;
  opacity: 1;
  pointer-events: auto;
}
.custom-notif.success {
  background: linear-gradient(135deg, #00b061, #00773d);
  box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
}
.custom-notif.error {
  background: linear-gradient(135deg, #d62828, #9b1d1d);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

/* ---------------- Confirmation Modal ---------------- */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.25s forwards;
}

.confirm-box {
  background: white;
  padding: 25px 30px;
  border-radius: 20px;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 12px 28px rgba(0,0,0,0.25);
  transform: scale(0.95);
  animation: scaleUp 0.25s forwards;
}
.confirm-box p {
  margin-bottom: 20px;
  font-weight: 600;
  color: #071815;
}
.confirm-actions {
  display: flex;
  justify-content: space-around;
}
.confirm-btn {
  padding: 10px 22px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #00b061, #00773d);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.confirm-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(0, 255, 150, 0.3);
}
.cancel-btn {
  padding: 10px 22px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #d62828, #9b1d1d);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.cancel-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(255,0,0,0.3);
}

/* ---------------- Animations ---------------- */
@keyframes fadeIn { to { opacity:1; } }
@keyframes scaleUp { to { transform: scale(1); } }

/* ---------------- Empty Table Text ---------------- */
.no-data {
  text-align: center;
  font-style: italic;
  color: #666;
  padding: 12px 0;
}

/* ---------------- Responsive Table ---------------- */
@media(max-width:900px){
  .modern-table th,
  .modern-table td { padding:10px 8px; font-size:14px; }
  tbody li { font-size:13px; }
}

</style>
