<template>
  <div class="contact-view">
    <h2>Contact Us</h2>

    <!-- Custom Notification -->
    <div
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      {{ notification.message }}
    </div>

    <form @submit.prevent="submitForm" class="contact-form">
      <div class="form-group">
        <input v-model="name" placeholder="Your Name" required />
      </div>

      <div class="form-group">
        <input v-model="email" type="email" placeholder="Your Email" required />
      </div>

      <div class="form-group">
        <textarea v-model="message" placeholder="Your Message" required></textarea>
      </div>

      <!-- Button aligned perfectly with inputs -->
      <div class="form-group">
        <button type="submit" class="btn-submit">Send Message</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: '',
      notification: {
        show: false,
        message: '',
        type: 'success',
      },
    }
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification.message = message
      this.notification.type = type
      this.notification.show = true
      setTimeout(() => (this.notification.show = false), 3000)
    },
    submitForm() {
      if (!this.name || !this.email || !this.message) {
        this.showNotification("Please fill in all fields.", "error")
        return
      }

      this.showNotification(`Thank you ${this.name}, your message has been sent!`)
      this.name = ''
      this.email = ''
      this.message = ''
    },
  },
}
</script>

<style scoped>
.contact-view {
  max-width: 600px;
  margin: 60px auto;
  padding: 40px 30px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
}

.contact-view h2 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 35px;
  color: #0f3d2e;
  font-weight: 700;
}

/* Form styling */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}

.form-group {
  width: 100%;
  max-width: 420px;
  margin: 0 auto; /* center input/button */
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid #ddd;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.05);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #7bf2b3;
  box-shadow: 0 0 12px rgba(123, 242, 179, 0.3);
}

textarea {
  min-height: 140px;
  resize: vertical;
}

/* Button styling */
.btn-submit {
  width: 110%; /* ensures button matches input width */
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #0f3d2e, #145943);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 77, 46, 0.3);
}

/* Notifications */
.custom-notif {
  position: fixed;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 28px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s ease;
  z-index: 9999;
}
.custom-notif.show {
  top: 20px;
  opacity: 1;
  pointer-events: auto;
}
.custom-notif.success {
  background: linear-gradient(135deg, #00b061, #00773d);
  box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
}
.custom-notif.error {
  background: linear-gradient(135deg, #d62828, #9b1d1d);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 640px) {
  .contact-view {
    margin: 30px 20px;
    padding: 30px 20px;
  }

  .contact-view h2 {
    font-size: 24px;
  }
}
</style>
