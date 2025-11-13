<template>
  <div class="products-view">
    <h2>Products</h2>

    <!-- Search -->
    <input
      v-model="searchQuery"
      placeholder="Search products..."
      class="search-input"
    />

    <!-- Products Grid -->
    <div class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.product_id"
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p>Category: {{ product.category }}</p>
        <p>Price: ₱{{ product.price }}</p>

        <!-- Sizes -->
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

        <!-- Quantity -->
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
          <button @click="addToCart(product)">Add to Cart</button>
          <button @click="showDetails(product.product_id)">View Details</button>
        </div>
      </div>
    </div>

    <p v-if="!filteredProducts.length">No products found.</p>

    <!-- Product Details Modal -->
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

      // Initialize selected size and quantity
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
          {
            product_id: product.product_id,
            size_id: size.id,
            quantity: qty,
            price: product.price
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
}

label {
  display: block;
  margin-top: 10px;
}

.buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 12px;
  cursor: pointer;
  background-color: #2d2d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
}
</style>
