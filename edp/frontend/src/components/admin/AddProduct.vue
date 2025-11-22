<template>
  <div class="add-product-container">
    <!-- Modern Custom Notification -->
    <div 
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      <div class="notif-content">
        <div class="notif-icon">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        {{ notification.message }}
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Add New Product</h1>
      <p class="page-subtitle">Create a new product listing for your store</p>
    </div>

    <!-- Main Form -->
    <div class="form-content">
      <!-- Product Information Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Product Information</h3>
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="form-grid">
          <!-- Product Name -->
          <div class="form-group">
            <label class="form-label">Product Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Enter product name"
              class="form-input"
              :class="{ error: errors.name }"
            />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label">Category</label>
            <select 
              v-model="form.category_id" 
              class="form-input"
              :class="{ error: errors.category_id }"
            >
              <option disabled :value="null">Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="error-message">{{ errors.category_id }}</p>
          </div>

          <!-- Price -->
          <div class="form-group">
            <label class="form-label">Price</label>
            <div class="input-with-prefix">
              <span class="prefix">₱</span>
              <input 
                v-model.number="form.price" 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00"
                class="form-input"
                :class="{ error: errors.price }"
              />
            </div>
            <p v-if="errors.price" class="error-message">{{ errors.price }}</p>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group full-width">
          <label class="form-label">Description</label>
          <textarea 
            v-model="form.description" 
            placeholder="Enter product description..."
            class="form-textarea"
            :class="{ error: errors.description }"
            rows="4"
          ></textarea>
          <p v-if="errors.description" class="error-message">{{ errors.description }}</p>
        </div>
      </div>

      <!-- Sizes & Stock Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Sizes & Inventory</h3>
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Add Size Form -->
        <div class="add-size-form">
          <div class="form-grid compact">
            <div class="form-group">
              <label class="form-label">Size</label>
              <input 
                v-model="newSize.size" 
                type="text"
                placeholder="e.g., S, M, L"
                maxlength="2"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Stock</label>
              <input 
                v-model.number="newSize.stock" 
                type="number"
                min="0"
                placeholder="0"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">&nbsp;</label>
              <button class="btn-add-size" @click="addSize">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Add Size and Stock
              </button>
            </div>
          </div>
          <p v-if="errors.sizes" class="error-message">{{ errors.sizes }}</p>
        </div>

        <!-- Added Sizes List -->
        <div class="sizes-list-container">
          <h4 class="sizes-list-title">Added Sizes</h4>
          
          <div v-if="form.sizes.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>No sizes added yet</p>
            <span>Add sizes and stock quantities above</span>
          </div>

          <div v-else class="sizes-grid">
            <div 
              v-for="(s, index) in form.sizes" 
              :key="index" 
              class="size-card"
            >
              <div class="size-info">
                <div class="size-badge">{{ s.size }}</div>
                <div class="stock-info">
                  <span class="stock-label">Stock:</span>
                  <span class="stock-value">{{ s.stock }}</span>
                </div>
              </div>
              <button 
                class="btn-remove"
                @click="removeSize(index)"
                title="Remove size"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <button class="btn-submit" @click="submitProduct">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Add Product
        </button>
      </div>
    </div>
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

      newSize: { size: '', stock: '' },

      errors: {},

      // Custom Notification
      notification: {
        show: false,
        message: '',
        type: '' // "success" or "error"
      }
    }
  },

  watch: {
    "form.name"(v) { if (v) this.errors.name = null },
    "form.description"(v) { if (v) this.errors.description = null },
    "form.price"(v) { if (v > 0) this.errors.price = null },
    "form.category_id"(v) { if (v) this.errors.category_id = null },
    "form.sizes"(v) { if (v.length > 0) this.errors.sizes = null },
    "newSize.size"(v) { if (v) this.errors.sizes = null },
    "newSize.stock"(v) { if (v >= 0) this.errors.sizes = null }
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
    showNotification(type, message) {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;

      setTimeout(() => {
        this.notification.show = false; // smooth hide
      }, 3000); // adjust duration if needed
    },


    addSize() {
      if (!this.newSize.size || this.newSize.stock === '') {
        this.errors.sizes = "Please enter size and stock."
        return
      }
      if (this.newSize.size > 99) {
        this.errors.sizes = "Size can only have up to 2 digits."
        return
      }

      this.form.sizes.push({ ...this.newSize })
      this.newSize = { size: '', stock: '' }
    },

    removeSize(index) {
      this.form.sizes.splice(index, 1)
    },

    validateForm() {
      this.errors = {}

      if (!this.form.name) this.errors.name = "Product name is required."
      if (!this.form.description) this.errors.description = "Description is required."
      if (!this.form.price || this.form.price <= 0) this.errors.price = "Price must be greater than 0."
      if (!this.form.category_id) this.errors.category_id = "Please select a category."
      if (this.form.sizes.length === 0) this.errors.sizes = "Add at least one size and stock."

      return Object.keys(this.errors).length === 0
    },

    async submitProduct() {
      if (!this.validateForm()) {
        this.showNotification("error", "Please fix the errors before submitting.");
        return;
      }

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

        // Reset form
        this.form = { name: '', description: '', price: '', category_id: null, sizes: [] }
        this.newSize = { size: '', stock: '' }

        this.showNotification("success", "Product successfully added!");

      } catch (err) {
        this.showNotification("error", "Something went wrong while adding the product.");
      }
    }
  }
}
</script>

<style scoped>
.add-product-container {
  width: 100%;
  margin: 0;
  padding: 30px;
  background: #ffffff;
  min-height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  color: #0a3c2b;
  font-weight: 700;
  font-size: 32px;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: #4a7c6d;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

/* Form Container */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: none;
}

/* Form Cards */
.form-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  transition: all 0.3s ease;
  width: 100%;
}

.form-card:hover {
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f9f5;
}

.card-header h3 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}

.card-icon {
  color: #1a7d5e;
  display: flex;
  align-items: center;
}

/* Form Layout */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  width: 100%;
}

.form-grid.compact {
  gap: 16px;
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  color: #0a3c2b;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
}

/* Form Inputs */
.form-input,
.form-textarea,
select.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
select.form-input:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
  background: white;
}

.form-input.error,
.form-textarea.error,
select.form-input.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Price Input */
.input-with-prefix {
  position: relative;
  width: 100%;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #1a7d5e;
  font-weight: 600;
  pointer-events: none;
  z-index: 1;
}

.input-with-prefix .form-input {
  padding-left: 36px;
}

/* Error Messages */
.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 6px;
  font-weight: 500;
}

/* Add Size Form */
.add-size-form {
  background: #f0f9f5;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 24px;
  width: 100%;
}

/* Buttons */
.btn-add-size {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #1a7d5e;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 44px;
  justify-content: center;
  width: 100%;
}

.btn-add-size:hover {
  background: #0a3c2b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.3);
}

/* Sizes List */
.sizes-list-container {
  margin-top: 16px;
  width: 100%;
}

.sizes-list-title {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 16px;
}

.sizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  width: 100%;
}

.size-card {
  background: white;
  border: 1px solid #e0f0e9;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  width: 100%;
}

.size-card:hover {
  border-color: #1a7d5e;
  box-shadow: 0 2px 8px rgba(26, 125, 94, 0.1);
}

.size-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.size-badge {
  background: #1a7d5e;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
}

.stock-info {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.stock-label {
  color: #4a7c6d;
}

.stock-value {
  color: #0a3c2b;
  font-weight: 600;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #fef2f2;
  color: #e53e3e;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #e53e3e;
  color: white;
  transform: scale(1.05);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #7aa895;
  width: 100%;
}

.empty-state svg {
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #4a7c6d;
}

.empty-state span {
  font-size: 14px;
}

/* Submit Section */
.submit-section {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(26, 125, 94, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 125, 94, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}

/* Modern Custom Notification */
.custom-notif {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
  min-width: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.custom-notif.show {
  top: 24px;
  opacity: 1;
  pointer-events: auto;
}

/* Success Notification */
.custom-notif.success {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  border-left: 4px solid #10b981;
}

/* Error Notification */
.custom-notif.error {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  border-left: 4px solid #f56565;
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-icon {
  display: flex;
  align-items: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .add-product-container {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .sizes-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .form-card {
    padding: 24px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .add-size-form {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .add-product-container {
    padding: 16px;
  }
  
  .form-card {
    padding: 20px;
  }
  
  .add-size-form .form-grid.compact {
    grid-template-columns: 1fr;
  }
  
  .btn-add-size {
    width: 100%;
  }
  
  .sizes-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .page-title {
    font-size: 24px;
  }
}
</style>