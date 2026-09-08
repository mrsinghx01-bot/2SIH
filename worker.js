export default {
  async fetch(request, env) {
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
      // SPA fallback for React Router
      const indexReq = new Request(new URL('/index.html', request.url), request);
      return await env.ASSETS.fetch(indexReq);
    } catch (err) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
