<template>
  <div class="about-modal-mask" @click.self="close">
    <div class="about-modal">
      <div class="about-header">
        <span>📝 关于本项目</span>
        <button class="about-close" @click="close">×</button>
      </div>
      <div class="about-content">
        <div class="about-row"><strong>作者：</strong>{{ about.author }}</div>

        <div class="about-section">
          <div class="about-row"><strong>🎯 产品优势：</strong></div>
          <ul class="about-list good-points">
            <li v-for="(item, idx) in about.good_point" :key="idx">{{ item }}</li>
          </ul>
        </div>

        <div class="about-section">
          <div class="about-row"><strong>💡 解决的痛点：</strong></div>
          <ul class="about-list pain-points">
            <li v-for="(item, idx) in about.pain_points" :key="idx">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import about from "../assets/about.json";
const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style scoped>
.about-modal-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.about-modal {
  background: #fff;
  border-radius: 10px;
  min-width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  padding: 2rem 2.2rem 1.5rem 2.2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  position: relative;
  overflow-y: auto;
}
.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
}
.about-close {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.about-close:hover {
  color: #333;
}
.about-content {
  font-size: 1rem;
  color: #333;
}
.about-row {
  margin-bottom: 0.7rem;
}
.about-list {
  margin: 0 0 0 1.2rem;
  padding: 0;
  color: #555;
  font-size: 0.98rem;
}
.about-list li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.about-section {
  margin-bottom: 1.5rem;
}

.good-points li {
  color: #2c5aa0;
  font-weight: 500;
}

.pain-points li {
  color: #e74c3c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-modal {
    min-width: 320px;
    padding: 1.5rem;
    margin: 1rem;
  }

  .about-header {
    font-size: 1.1rem;
  }

  .about-content {
    font-size: 0.9rem;
  }
}
</style>
