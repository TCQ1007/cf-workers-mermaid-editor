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
	fetch(request) {
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

		// 对于其他路径，返回404但仍然包含CORS头部
		const response = new Response(null, { status: 404 });
		return addCorsHeaders(response);
	},
};
