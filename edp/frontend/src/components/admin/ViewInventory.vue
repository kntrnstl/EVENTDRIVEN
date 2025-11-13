<template>
  <div class="inventory-container">
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
            <td>{{ product.category }}</td>
            <td>{{ product.price }}</td>
            <td>
              <ul>
                <li v-for="size in product.sizes" :key="size.id">
                  {{ size.size }} : {{ size.stock }}
                </li>
              </ul>
            </td>
            <td>
              <button class="delete-btn" @click="deleteProduct(product.product_id)">🗑️ Delete</button>
            </td>
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
      products: []
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get('/api/admin/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.products = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return;
      try {
        await axios.delete(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>

<style scoped>
.inventory-container {
  width: 100%;
  
}

h2 {
  color: #00ffcc;
  font-weight: 700;
  margin-bottom: 20px;
}

/* ---------------- Table Wrapper ---------------- */
.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
}

/* ---------------- Modern Table ---------------- */
.modern-table {
  width: 100%;
  max-width: 100%;
  margin:0 auto;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(8, 24, 18, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 255, 128, 0.1);
}

thead th {
  text-align: left;
  padding: 14px;
  background: rgba(0,255,128,0.1);
  color: #00ffcc;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 2;
}

tbody td {
  padding: 12px 14px;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  vertical-align: middle;
}

tbody tr:hover {
  background: rgba(0,255,128,0.1);
  transition: background 0.3s ease;
}

/* Nested UL for sizes */
tbody ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

tbody li {
  margin-bottom: 4px;
  font-size: 14px;
}

/* Delete Button */
.delete-btn {
  background: linear-gradient(135deg, #ff4d4d, #ff1a1a);
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 77, 77, 0.4);
}

/* Responsive */
@media(max-width:900px){
  .table-wrapper {
    overflow-x: auto;
  }
  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
    font-size: 14px;
  }
}
</style>
