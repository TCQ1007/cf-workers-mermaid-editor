export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// CORS头部
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
		};

		// 处理预检请求
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 200, headers: corsHeaders });
		}

		// API路由
		if (url.pathname.startsWith("/api/")) {
			return Response.json({ name: "Cloudflare" }, { headers: corsHeaders });
		}

		// 静态资源
		try {
			const response = await env.ASSETS.fetch(request);
			const newResponse = new Response(response.body, {
				status: response.status,
				headers: { ...response.headers, ...corsHeaders }
			});
			return newResponse;
		} catch {
			return new Response('Not Found', {
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
			});
		}
	},
};
