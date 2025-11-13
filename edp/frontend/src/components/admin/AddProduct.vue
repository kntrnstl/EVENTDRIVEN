<template>
  <div class="add-product-container">
    <h2>Add Product</h2>

    <input v-model="form.name" placeholder="Product Name" />
    <textarea v-model="form.description" placeholder="Description"></textarea>
    <input v-model.number="form.price" type="number" placeholder="Price" />
    <select v-model="form.category_id">
      <option v-for="cat in categories" :value="cat.id" :key="cat.id">
        {{ cat.name }}
      </option>
    </select>

    <div class="sizes-container">
      <h4>Sizes & Stock</h4>
      <div class="sizes-inputs">
        <input v-model="newSize.size" placeholder="Size" />
        <input v-model.number="newSize.stock" type="number" placeholder="Stock" />
        <button @click="addSize">Add Size</button>
      </div>
      <ul>
        <li v-for="(s, index) in form.sizes" :key="index">
          {{ s.size }} : {{ s.stock }}
          <button @click="removeSize(index)">x</button>
        </li>
      </ul>
    </div>

    <button class="submit-btn" @click="submitProduct">Add Product</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      categories: [],
      form: {
        name: '',
        description: '',
        price: '',
        category_id: null,
        sizes: []
      },
      newSize: { size: '', stock: '' }
    }
  },
  async created() {
    try {
      const res = await axios.get('/api/admin/categories', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      this.categories = res.data
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    addSize() {
      if (this.newSize.size && this.newSize.stock >= 0) {
        this.form.sizes.push({ ...this.newSize })
        this.newSize = { size: '', stock: 0 }
      } else {
        alert('Please enter size and stock')
      }
    },
    removeSize(index) {
      this.form.sizes.splice(index, 1)
    },
    async submitProduct() {
      try {
        const { sizes, ...productData } = this.form
        const res = await axios.post('/api/admin/products', productData, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        const productId = res.data.id

        for (let s of sizes) {
          await axios.post(`/api/admin/products/${productId}/sizes`, s, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          })
        }

        alert('Product added successfully!')
        this.form = { name: '', description: '', price: 0, category_id: null, sizes: [] }
        this.newSize = { size: '', stock: 0 }
      } catch (err) {
        alert(err.response?.data?.message || 'Error adding product')
      }
    }
  }
}
</script>

<style scoped>
.add-product-container {
  padding: 25px;
  max-width: 500px;
  margin: auto;
}

/* Headings */
h2 {
  color: #00ffcc;
  font-weight: 700;
  margin-bottom: 20px;
}
.sizes-container h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #00ffcc;
}

/* ---------------- Leveled Inputs ---------------- */
.add-product-container input,
.add-product-container textarea,
.add-product-container select {
  width: 100%;
  padding: 12px 15px;
  margin: 8px 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 255, 128, 0.05);
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  height: 45px; /* same height for all fields */
  box-sizing: border-box;
}
.add-product-container textarea {
  height: 90px; /* slightly taller for description */
  resize: none;
}
.add-product-container input:focus,
.add-product-container textarea:focus,
.add-product-container select:focus {
  border-color: rgba(0, 255, 128, 0.5);
  background: rgba(0, 255, 128, 0.15);
  box-shadow: 0 0 10px rgba(0, 255, 128, 0.3);
}

/* Sizes Inputs */
.sizes-inputs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.sizes-inputs input {
  flex: 1;
  height: 45px; /* same height */
}
.sizes-inputs button {
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #00ffcc, #00cc99);
  color: #071815;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 45px; /* match input height */
}
.sizes-inputs button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 255, 128, 0.3);
}

/* Sizes List */
.add-product-container ul {
  padding-left: 0;
  list-style: none;
  margin-top: 10px;
}
.add-product-container ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 14px;
}
.add-product-container ul li button {
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 8px;
  border: none;
  background: #ff4d4d;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}
.add-product-container ul li button:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(255, 77, 77, 0.3);
}

/* Submit Button */
.submit-btn {
  margin-top: 20px;
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #00ffcc, #00cc99);
  color: #071815;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 45px;
}
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 255, 128, 0.3);
}
</style>
