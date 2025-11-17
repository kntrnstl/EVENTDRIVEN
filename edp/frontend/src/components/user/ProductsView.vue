<template>
  <div class="products-view">
    <h2>Products</h2>

    <input
      v-model="searchQuery"
      placeholder="Search products..."
      class="search-input"
    />

    <div class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.product_id"
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="category">Category: {{ product.category }}</p>
        <p class="price">₱{{ product.price }}</p>

        <label>
          Size:
          <select v-model="selectedSize[product.product_id]">
            <option
              v-for="size in product.sizes"
              :key="size.id"
              :value="size"
            >
              {{ size.size }} (Stock: {{ size.stock }})
            </option>
          </select>
        </label>

        <label>
          Quantity:
          <input
            type="number"
            v-model.number="quantity[product.product_id]"
            min="1"
            :max="selectedSize[product.product_id]?.stock || 1"
          />
        </label>

        <div class="buttons">
          <button class="btn-add-cart" @click="addToCart(product)">Add</button>
          <button class="btn-details" @click="showDetails(product.product_id)">View</button>
        </div>
      </div>
    </div>

    <p v-if="!filteredProducts.length" class="no-products">No products found.</p>

    <ProductDetails
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ProductDetails from './ProductDetails.vue'

export default {
  components: { ProductDetails },
  data() {
    return {
      products: [],
      searchQuery: '',
      selectedSize: {},
      quantity: {},
      selectedProduct: null
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products
      return this.products.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  async created() {
    try {
      const res = await axios.get('http://localhost:3000/api/products')
      this.products = res.data
      this.products.forEach(p => {
        this.selectedSize[p.product_id] = p.sizes[0] || null
        this.quantity[p.product_id] = 1
      })
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    async addToCart(product) {
      const size = this.selectedSize[product.product_id]
      const qty = this.quantity[product.product_id]

      if (!size) return alert('Please select a size')
      if (qty < 1 || qty > size.stock) return alert(`Quantity must be between 1 and ${size.stock}`)

      const token = localStorage.getItem('token')
      if (!token) return alert('Please login first.')

      try {
        await axios.post(
          'http://localhost:3000/api/cart',
          { product_id: product.product_id, size_id: size.id, quantity: qty, price: product.price },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert(`${product.name} added to cart!`)
      } catch (err) {
        console.error(err)
        alert(err.response?.data?.message || 'Failed to add to cart')
      }
    },
    async showDetails(productId) {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${productId}`)
        this.selectedProduct = res.data
      } catch (err) {
        alert('Failed to fetch product details')
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
.products-view {
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.products-view h2 {
  text-align: center;
  font-size: 26px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 350px;
  padding: 8px 12px;
  margin: 0 auto 20px auto;
  display: block;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

/* --- ORIGINAL SMALL CARD STYLE --- */
.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.2s ease;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

label {
  display: block;
  margin-top: 10px;
}

select, input[type="number"] {
  width: 100%;
  padding: 5px 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.buttons {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

button {
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-add-cart {
  background: #0f3d2e;
  color: #fff;
}
.btn-add-cart:hover {
  background: #145943;
}
.btn-details {
  background: #7bf2b3;
  color: #0f3d2e;
}
.btn-details:hover {
  background: #57d9a0;
}

.no-products {
  text-align: center;
  color: #555;
  margin-top: 20px;
}
</style>
