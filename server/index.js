export default {
	fetch: async (request, env) => {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		};

		// API路由
		if (request.url.includes("/api/")) {
			return Response.json({ message: "This Cloudflare workers Not Support API" }, { headers: corsHeaders });
		}

		// 静态资源
		const response = await env.ASSETS.fetch(request);
		return new Response(response.body, {
			status: response.status,
			headers: {...response.headers, ...corsHeaders}
		});
	}
};
