export default {
	fetch: async (request, env) => {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		};

		const url = new URL(request.url);

		// 处理微前端路径重写 - 忽略第一个路径段
		const pathSegments = url.pathname.split('/').filter(Boolean);
		if (pathSegments.length > 0) {
			// 检查第一个路径段是否可能是微前端前缀
			const firstSegment = pathSegments[0];
			// 如果第一个段不是已知的静态资源路径，则认为是微前端前缀
			if (!firstSegment.includes('.') && firstSegment !== 'api') {
				const newPath = '/' + pathSegments.slice(1).join('/');
				const newUrl = new URL(request.url);
				newUrl.pathname = newPath || '/';
				request = new Request(newUrl, request);
				console.log(`🔄 微前端路径重写: ${url.pathname} -> ${newUrl.pathname}`);
			}
		}

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
