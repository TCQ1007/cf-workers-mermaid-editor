<template>
  <a
    :href="href"
    class="github-corner"
    target="_blank"
    rel="noopener noreferrer"
    :title="title"
  >
    <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align: middle;">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  </a>
</template>

<script setup>
const props = defineProps({
  href: { type: String, required: true },
  title: { type: String, default: 'GitHub 仓库' }
});
</script>

<style scoped>
.github-corner {
  margin-left: auto;
  height: 32px;
  width: 32px;
  z-index: 1002;
  color: #24292f;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background: rgba(255,255,255,0.95);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 4px;
  transition: color 0.2s, box-shadow 0.2s;
}
.github-corner:hover {
  color: #0366d6;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}
</style> 