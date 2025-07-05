// 添加CORS头部的辅助函数
function addCorsHeaders(response) {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
		'Access-Control-Max-Age': '86400', // 24小时
	};

	// 创建新的Response对象，因为原Response的headers是只读的
	if (response instanceof Response) {
		const newHeaders = new Headers(response.headers);
		Object.entries(corsHeaders).forEach(([key, value]) => {
			newHeaders.set(key, value);
		});

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders
		});
	}

	// 如果是Response配置对象，合并headers
	return {
		...response,
		headers: {
			...corsHeaders,
			...(response.headers || {}),
		},
	};
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		let pathname = url.pathname;

		// 处理预检请求 (OPTIONS)
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
					'Access-Control-Max-Age': '86400'
				}
			});
		}

		// 不需要路径重写，前端会根据环境自动处理路由

		// API路由处理
		if (pathname.startsWith("/api/")) {
			const response = Response.json({
				name: "Cloudflare",
				message: "API endpoint with CORS support"
			});
			return addCorsHeaders(response);
		}

		// 对于静态资源，使用Cloudflare的静态资源处理器
		try {
			// 获取静态资源响应
			const response = await env.ASSETS.fetch(request);
			// 为静态资源响应添加CORS头部
			return addCorsHeaders(response);
		} catch (error) {
			console.error('静态资源处理错误:', error.message);

			// 如果静态资源不存在，返回404并包含CORS头部
			const response = new Response('Not Found', {
				status: 404,
				headers: {
					'Content-Type': 'text/plain'
				}
			});
			return addCorsHeaders(response);
		}
	},
};
