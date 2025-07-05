import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { cloudflare } from "@cloudflare/vite-plugin"

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
	// 在构建时根据环境变量决定base路径
	const base = process.env.MICRO_APP_MODE === 'true' ? '/mermaid/' : '/'

	console.log(`🔧 Vite配置: mode=${mode}, command=${command}, base=${base}`)

	return {
		base,
		plugins: [
			vue(),
			vueDevTools(),
			cloudflare()
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			},
		},
		// 开发服务器配置
		server: {
			// 支持微前端开发时的代理配置
			proxy: mode === 'development' && process.env.MICRO_APP_MODE === 'true' ? {
				'/mermaid': {
					target: 'http://localhost:5173',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/mermaid/, '')
				}
			} : undefined
		}
	}
})
