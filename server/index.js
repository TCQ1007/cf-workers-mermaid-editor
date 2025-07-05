// 添加CORS头部的辅助函数
function addCorsHeaders(response) {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
		'Access-Control-Max-Age': '86400', // 24小时
	};

	// 如果是新的Response对象，直接设置headers
	if (response instanceof Response) {
		Object.entries(corsHeaders).forEach(([key, value]) => {
			response.headers.set(key, value);
		});
		return response;
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

		// 处理预检请求 (OPTIONS)
		if (request.method === 'OPTIONS') {
			return new Response(null, addCorsHeaders({
				status: 200,
				headers: {}
			}));
		}

		// API路由处理
		if (url.pathname.startsWith("/api/")) {
			const response = Response.json({
				name: "Cloudflare",
				message: "API endpoint with CORS support"
			});
			return addCorsHeaders(response);
		}

		// 对于静态资源，使用Cloudflare的静态资源处理器
		// 然后为响应添加CORS头部
		try {
			// 获取静态资源响应
			const response = await env.ASSETS.fetch(request);

			// 为静态资源响应添加CORS头部
			return addCorsHeaders(response);
		} catch (error) {
			// 如果静态资源不存在，返回404并包含CORS头部
			const response = new Response('Not Found', { status: 404 });
			return addCorsHeaders(response);
		}
	},
};
