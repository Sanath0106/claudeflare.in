/**
 * claudeflare.in — Visitor Counter Worker
 * Deploy to Cloudflare Workers with a KV namespace bound as VISITORS
 *
 * KV keys:
 *   total  — running total of all visits
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://claudeflare.in',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Atomically increment total
    const raw   = await env.VISITORS.get('total');
    const total = (parseInt(raw || '0', 10)) + 1;
    await env.VISITORS.put('total', String(total));

    return new Response(JSON.stringify({ total }), { headers: corsHeaders });
  },
};
