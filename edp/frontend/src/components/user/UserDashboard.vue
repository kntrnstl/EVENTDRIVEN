<template>
  <div class="user-dashboard">

    <!-- Custom Notification -->
    <div
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      {{ notification.message }}
    </div>

    <!-- NAVBAR -->
    <nav class="navbar">
      <h1 class="logo">MyShop</h1>

      <ul class="nav-links">
        <li><a @click.prevent="setView('home')" :class="{ active: currentView==='home' }">Home</a></li>
        <li><a @click.prevent="setView('products')" :class="{ active: currentView==='products' }">Products</a></li>
        <li><a @click.prevent="setView('cart')" :class="{ active: currentView==='cart' }">Cart ({{ cart.length }})</a></li>
        <li><a @click.prevent="setView('contact')" :class="{ active: currentView==='contact' }">Contact</a></li>
      </ul>

      <button class="logout-btn" @click="confirmLogout">Logout</button>
    </nav>

    <!-- MAIN VIEW -->
    <transition name="view-transition" mode="out-in">
      <div class="view-container" :key="currentView">
        <HomeView v-if="currentView==='home'" />
        <ProductsView
          v-if="currentView==='products'"
          :cart="cart"
          @add-to-cart="addToCart"
        />
        <CartView
          v-if="currentView==='cart'"
          :cart="cart"
          @update-cart="updateCart"
          @remove-item="removeFromCart"
        />
        <ContactView v-if="currentView==='contact'" />
      </div>
    </transition>

    <!-- Logout Modal -->
    <div v-if="showLogoutConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>Are you sure you want to logout?</p>
        <div class="confirm-actions">
          <button class="confirm-btn" @click="logout">Yes</button>
          <button class="cancel-btn" @click="showLogoutConfirm=false">No</button>
        </div>
      </div>
    </div>

     <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-section social-media">
          <h4>Follow Us</h4>
          <div class="social-buttons">
            <a href="#" target="_blank" class="social-btn facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" class="social-btn instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" class="social-btn twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" class="social-btn linkedin">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div class="footer-section contact-info">
          <h4>Contact</h4>
          <p>Email: support@myshop.com</p>
          <p>Phone: +63 912 345 6789</p>
        </div>

        <div class="footer-section location">
          <h4>Location</h4>
          <p>123 Green Street, Barcenaga, Naujan, Oriental Mindoro</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 MyShop. All rights reserved.</p>
      </div>
    </footer>

  </div>
</template>

<script>
import HomeView from './HomeView.vue'
import ProductsView from './ProductsView.vue'
import CartView from './CartView.vue'
import ContactView from './ContactView.vue'

export default {
  components: { HomeView, ProductsView, CartView, ContactView },
  data() {
    return {
      currentView: 'home',
      cart: JSON.parse(localStorage.getItem('cart') || '[]'),
      showLogoutConfirm: false,
      notification: { show: false, message: '', type: 'success' }
    }
  },
  methods: {
    setView(view) { this.currentView = view; window.scrollTo({ top: 0, behavior: "smooth" }) },
    confirmLogout() { this.showLogoutConfirm = true },
    showNotification(type, message) { this.notification = { show: true, type, message }; setTimeout(() => this.notification.show = false, 3000) },
    logout() { 
      this.showLogoutConfirm = false
      this.showNotification('success', 'You have logged out successfully!')
      setTimeout(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.setItem('cart', JSON.stringify(this.cart))
        this.$router.push('/')
      }, 1000)
    },
    addToCart(item) {
      const existing = this.cart.find(i => i.product_id === item.product_id && i.size === item.size)
      if (existing) existing.quantity += item.quantity
      else this.cart.push(item)
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    updateCart(updatedCart) { this.cart = updatedCart; localStorage.setItem('cart', JSON.stringify(this.cart)) },
    removeFromCart(index) { this.cart.splice(index, 1); localStorage.setItem('cart', JSON.stringify(this.cart)) }
  }
}
</script>

<style scoped>
/* ===== GLOBAL ===== */
.user-dashboard {
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #0f3d2e;
}

/* ===== NAVBAR ===== */
.navbar {
  display: flex;
  align-items: center;
  background: #0f3d2e;
  padding: 16px 40px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  position: relative;
  
}

/* LOGO */
.logo {
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: 0.25s;
}
.logo:hover { opacity: 0.8; }

/* CENTER NAV LINKS */
.nav-links { display: flex; list-style: none; gap: 32px; align-items: center; position: absolute; left: 50%; transform: translateX(-50%); }
.nav-links a { position: relative; color: #d8efe3; text-decoration: none; font-size: 15.5px; cursor: pointer; padding: 8px 4px; transition: 0.25s ease; font-weight: 500; }
.nav-links a::after { content: ""; position: absolute; left: 0; bottom: -3px; width: 0%; height: 2px; background: #7bf2b3; border-radius: 2px; transition: width 0.25s ease; }
.nav-links a:hover::after, .nav-links a.active::after { width: 100%; }

/* LOGOUT BUTTON */
.logout-btn {
  margin-left: auto;
  background: linear-gradient(135deg,#ff4d4d,#ff1a1a);
  color:#fff;
  padding:8px 16px;
  border-radius:12px;
  font-weight:600;
  cursor:pointer;
  transition: all 0.3s ease;
}
.logout-btn:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 6px 18px rgba(255,77,77,0.4); }

/* VIEW CONTAINER */
.view-container { padding:40px; min-height: calc(100vh - 80px); overflow:hidden; position:relative; }

/* VIEW TRANSITION */
.view-transition-leave-active,
.view-transition-enter-active { transition: all 0.35s ease; }
.view-transition-leave-to { opacity: 0; transform: translateY(-20px); }
.view-transition-enter-from { opacity: 0; transform: translateY(20px); }
.view-transition-enter-to { opacity: 1; transform: translateY(0); }

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
.custom-notif.show { top: 20px; opacity:1; pointer-events:auto; }
.custom-notif.success { background: linear-gradient(135deg,#00b061,#00773d); box-shadow:0 5px 15px rgba(0,255,150,0.3); }
.custom-notif.error { background: linear-gradient(135deg,#d62828,#9b1d1d); box-shadow:0 5px 15px rgba(255,0,0,0.3); }

/* ---------------- Logout Modal ---------------- */
.confirm-overlay { position:fixed; inset:0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:10000; }
.confirm-box { background:white; padding:25px 30px; border-radius:20px; text-align:center; max-width:400px; box-shadow:0 12px 28px rgba(0,0,0,0.25); }
.confirm-box p { margin-bottom:20px; font-weight:600; color:#071815; }
.confirm-actions { display:flex; justify-content:space-around; }
.confirm-btn { padding:10px 22px; border-radius:12px; border:none; background: linear-gradient(135deg,#00b061,#00773d); color:#fff; font-weight:600; cursor:pointer; transition:all 0.3s ease;}
.confirm-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow:0 6px 18px rgba(0,255,150,0.3);}
.cancel-btn { padding:10px 22px; border-radius:12px; border:none; background: linear-gradient(135deg,#d62828,#9b1d1d); color:#fff; font-weight:600; cursor:pointer; transition:all 0.3s ease;}
.cancel-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow:0 6px 18px rgba(255,0,0,0.3);}

/* ===== FOOTER ===== */
.footer {
  background: #0f3d2e;
  color: #d8efe3;
  font-family: 'Inter', sans-serif;
  padding: 40px 30px 20px;
  margin-top: 0px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 25px;
}

.footer-section h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #7bf2b3;
}

.footer-section p {
  margin-bottom: 8px;
  font-size: 14px;
  color: #d8efe3;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #145943;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 255, 150, 0.4);
}

.social-btn.facebook { background: #3b5998; }
.social-btn.instagram { background: #e1306c; }
.social-btn.twitter { background: #1da1f2; }
.social-btn.linkedin { background: #0077b5; }

.footer-bottom {
  text-align: center;
  font-size: 13px;
  color: #c0e9d4;
}
</style>
