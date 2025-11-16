<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <h1>Welcome to MyShop!</h1>
      <p>Discover our amazing products and special offers.</p>
      <button class="btn-shop-now">Shop Now</button>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="products-grid">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p class="price">₱{{ product.price.toFixed(2) }}</p>
          <button class="btn-add-cart">Add to Cart</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      featuredProducts: []
    }
  },
  async created() {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${token}` } // optional if public
      })
      this.featuredProducts = res.data.slice(0, 4) // first 4 as featured
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }
}
</script>

<style scoped>
/* ---------------- Base ---------------- */
.home-view {
  font-family: 'Inter', sans-serif;
  background: #f5f7f6;
  color: #071815;
  padding: 30px;
}

/* ---------------- Hero Section ---------------- */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
}
.hero-section h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #041c12;
  margin-bottom: 10px;
}
.hero-section p {
  font-size: 18px;
  color: #0a3c2b;
  margin-bottom: 20px;
}
.btn-shop-now {
  padding: 12px 25px;
  background: linear-gradient(135deg, #00ffcc, #00cc99);
  color: #071815;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-shop-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 255, 128, 0.3);
}

/* ---------------- Featured Products ---------------- */
.featured-products h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  color: #041c12;
  margin-bottom: 20px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
}
.product-card h3 {
  font-size: 20px;
  color: #041c12;
  margin-bottom: 10px;
}
.product-card p {
  font-size: 14px;
  color: #071815;
  margin-bottom: 10px;
}
.product-card .price {
  font-weight: 600;
  color: #00ffcc;
  font-size: 16px;
  margin-bottom: 15px;
}
.product-card .btn-add-cart {
  margin-top: auto;
  padding: 10px 0;
  background: linear-gradient(135deg, #00ffcc, #00cc99);
  color: #071815;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.product-card .btn-add-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 255, 128, 0.3);
}

/* ---------------- Responsive ---------------- */
@media(max-width: 768px) {
  .hero-section h1 {
    font-size: 28px;
  }
  .hero-section p {
    font-size: 16px;
  }
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
