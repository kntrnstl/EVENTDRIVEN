<template>
  <div class="cart-view">
    <h2>Shopping Cart</h2>

    <table v-if="cart.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.size }}</td>
          <td>₱{{ item.price }}</td>
          <td>
            <input type="number" v-model.number="item.quantity" min="1" @change="updateQuantity(item)" />
          </td>
          <td>₱{{ (item.price * item.quantity).toFixed(2) }}</td>
          <td>
            <button @click="removeItem(item.id)">X</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Your cart is empty</p>
    <p v-if="cart.length">Total: ₱{{ totalPrice.toFixed(2) }}</p>
    <button @click="checkout" :disabled="!cart.length">Checkout</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      cart: []
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }
  },
  methods: {
    async fetchCart() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.cart = res.data
      } catch (err) {
        console.error('Fetch cart error:', err)
      }
    },
    async updateQuantity(item) {
      try {
        const token = localStorage.getItem('token')
        await axios.put(
          `/api/cart/${item.id}`,
          { quantity: item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        await this.fetchCart()
      } catch (err) {
        alert('Failed to update quantity')
      }
    },
    async removeItem(itemId) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`/api/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchCart()
      } catch (err) {
        alert('Failed to remove item')
      }
    },
    async checkout() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return alert('Please login first.')

        await axios.post(
          '/api/orders',
          {
            items: this.cart.map(item => ({
              product_id: item.product_id,
              size_id: item.size_id,
              quantity: item.quantity,
              price: item.price
            })),
            total: this.totalPrice
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        alert('Order placed successfully!')
        this.cart = []
        await this.fetchCart()
      } catch (err) {
        alert(err.response?.data?.message || 'Checkout failed')
      }
    }
  },
  async mounted() {
    await this.fetchCart()
  }
}
</script>


<style scoped>
.cart-view {
  font-family: 'Inter', sans-serif;
  padding: 30px;
}

/* Cart Card */
.cart-card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.cart-card table {
  width: 100%;
  border-collapse: collapse;
}

.cart-card th, .cart-card td {
  text-align: left;
  padding: 12px 15px;
}

.cart-card th {
  background: #f5f5f5;
  font-weight: 600;
}

.cart-card tbody tr:nth-child(even) {
  background: #fafafa;
}

.cart-card tbody tr:hover {
  background: #f0fdf4;
}

.cart-card input[type="number"] {
  width: 60px;
  padding: 5px 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  text-align: center;
  transition: 0.25s ease;
}
.cart-card input[type="number"]:focus {
  border-color: #00b061;
  outline: none;
}

/* Remove Button */
.remove-btn {
  background: linear-gradient(135deg,#d62828,#9b1d1d);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease;
}
.remove-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 18px rgba(255,0,0,0.3);
}

/* Checkout */
.cart-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkout-btn {
  background: linear-gradient(135deg,#00b061,#00773d);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 25px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}
.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(0,255,150,0.3);
}

/* Empty cart */
.empty-cart {
  text-align: center;
  font-weight: 600;
  color: #555;
  margin-top: 50px;
}

/* Custom Notification */
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
.custom-notif.show { top: 20px; opacity:1; pointer-events:auto; }
.custom-notif.success { background: linear-gradient(135deg,#00b061,#00773d); box-shadow:0 5px 15px rgba(0,255,150,0.3); }
.custom-notif.error { background: linear-gradient(135deg,#d62828,#9b1d1d); box-shadow:0 5px 15px rgba(255,0,0,0.3); }
</style>
