<template>
  <div class="inventory-container">

    <!-- Modern Custom Notification -->
    <div 
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      {{ notification.message }}
    </div>

    <!-- Header -->
    <div class="header-section">
      <h2 class="page-title">Order Processing Dashboard 📦</h2>
      <div class="summary-card">
        <span class="summary-value">{{ orders.length }}</span>
        <span class="summary-label">Active Orders</span>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-wrapper">
      <table class="modern-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th class="text-right">Total (₱)</th>
            <th class="items-col">Items</th>
            <th>Status</th>
            <th class="action-col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0">
            <td colspan="6" class="no-data">
              {{ isLoading ? 'Loading orders...' : 'No active orders found.' }}
            </td>
          </tr>
          <tr v-for="order in orders" :key="order.order_id">
            <td class="id-col">#{{ order.order_id }}</td>
            <td>{{ order.username }}</td>
            <td class="text-right">₱{{ typeof order.total === 'number' ? order.total.toFixed(2) : order.total }}</td>

            <!-- Items Nested Table -->
            <td class="items-col">
              <div class="inner-table-container">
                <table class="inner-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                      <td>{{ item.product_name }}</td>
                      <td>{{ item.size || 'N/A' }}</td>
                      <td class="qty-col">{{ item.quantity }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>

            <!-- Status -->
            <td>
              <select v-model="order.status" :class="getStatusClass(order.status)">
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>

            <!-- Action Button -->
            <td class="action-col">
              <button 
                class="icon-btn update-btn"
                @click="updateStatus(order)"
                :disabled="order.isUpdating"
              >
                <span v-if="order.isUpdating">Saving...</span>
                <span v-else>Update</span>
              </button>
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
      orders: [],
      notification: { show: false, message: '', type: '' },
      isLoading: false,
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    getStatusClass(status) {
      switch (status?.toLowerCase()) {
        case 'delivered': return 'status-delivered';
        case 'out for delivery': return 'status-delivery';
        case 'preparing': return 'status-preparing';
        case 'cancelled': return 'status-cancelled';
        case 'pending':
        default: return 'status-pending';
      }
    },

    // Show notification with dynamic color based on status
    showNotification(message, status = 'success') {
      const statusColorMap = {
        pending: 'pending',
        preparing: 'info',
        'out for delivery': 'delivery',
        delivered: 'success',
        cancelled: 'error'
      };
      this.notification.type = statusColorMap[status?.toLowerCase()] || status;
      this.notification.message = message;
      this.notification.show = true;
      setTimeout(() => this.notification.show = false, 3000);
    },

    async fetchOrders() {
      this.isLoading = true;
      try {
        const res = await axios.get('/api/admin/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.orders = res.data.map(o => ({ ...o, isUpdating: false }));
      } catch (err) {
        console.error(err);
        this.showNotification('Failed to fetch orders', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(order) {
      order.isUpdating = true;
      // Notification with order.status color
      this.showNotification(`Updating order #${order.order_id}...`, order.status);
      try {
        await axios.put(`/api/admin/orders/${order.order_id}`, 
          { status: order.status }, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.showNotification(`Order #${order.order_id} updated to ${order.status}`, order.status);
      } catch (err) {
        console.error(err);
        this.showNotification(`Failed to update order #${order.order_id}`, 'error');
      } finally {
        order.isUpdating = false;
      }
    }
  }
};
</script>

<style scoped>
.inventory-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  font-family: 'Inter', sans-serif;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0f5ea;
}
.page-title { font-size: 32px; font-weight: 800; color: #1A5E46; }
.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 25px;
  background: #0a3c2b;
  border: 1px solid #00CC99;
  border-radius: 12px;
}
.summary-value { font-size: 28px; font-weight: 900; color: white; }
.summary-label { font-size: 14px; font-weight: 600; color: #00CC99; }

/* Table */
.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
  border: 1px solid #e0f5ea;
}
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
thead th {
  text-align: left;
  padding: 16px 20px;
  background: #f5fdf9;
  color: #0a3c2b;
  font-weight: 700;
  border-bottom: 2px solid #0a3c2b;
  position: sticky;
  top: 0;
}
tbody td { padding: 14px 20px; border-bottom: 1px solid #e0f5ea; }
tbody tr:hover { background: #f0fff6; }

/* Inner Table */
.inner-table-container { max-height: 180px; overflow-y: auto; border: 1px solid #d1e7d8; border-radius: 8px; background: #f7fcf9; }
.inner-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.inner-table th, .inner-table td { padding: 8px 10px; }
.inner-table thead { background-color: #d1e7d8; font-weight: 600; position: sticky; top: 0; }

/* Status Dropdown General Styling */
tbody td select {
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid #ccc;
  background: #f5fdf9;
  color: #0a3c2b;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}
tbody td select:hover,
tbody td select:focus {
  border-color: #00CC99;
  box-shadow: 0 2px 8px rgba(0, 204, 153, 0.3);
  outline: none;
}

/* Individual Status Colors */
.status-pending { background: #fff7e6; color: #f59e0b; }
.status-preparing { background: #e6f0ff; color: #3b82f6; }
.status-delivery { background: #f3e6ff; color: #8b5cf6; }
.status-delivered { background: #e6fff3; color: #10b981; }
.status-cancelled { background: #ffe6e6; color: #ef4444; }

/* Update Button */
.icon-btn.update-btn { background: #0a3c2b; color: #fff; border-radius: 8px; padding: 6px 12px; cursor: pointer; font-weight: 600; }
.icon-btn.update-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Modern Smooth Notification */
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
  z-index: 99999;
}
.custom-notif.show {
  top: 20px;
  opacity: 1;
  pointer-events: auto;
}


.custom-notif.pending { background: linear-gradient(135deg, #f59e0b, #d97706); /* amber/orange */ box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);}
.custom-notif.success { background: linear-gradient(135deg, #00b061, #00773d); box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3); }
.custom-notif.error { background: linear-gradient(135deg, #d62828, #9b1d1d); box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3); }
.custom-notif.info { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3); }
.custom-notif.delivery { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }

/* Responsive */
@media(max-width:900px){
  .inventory-container { padding: 20px; margin: 20px auto; }
  .header-section { flex-direction: column; align-items: flex-start; gap: 15px; }
  .page-title { font-size: 28px; }
  .modern-table th, .modern-table td { padding:12px 10px; font-size:14px; }
}
</style>
