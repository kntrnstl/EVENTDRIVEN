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
