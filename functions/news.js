// functions/news.js
// Cloudflare Pages Function: 代理学信网推送接口
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
  
    // 构造目标 URL：透传所有查询参数到学信网接口
    const targetUrl = `https://push.chsi.com.cn/category.do${url.search}`;
  
    console.log('[Proxy] Requesting:', targetUrl);
  
    try {
      // 发起代理请求
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Referer': 'https://www.chsi.com.cn/',
        },
        redirect: 'follow',
      });
  
      console.log('[Proxy] Upstream status:', response.status);
  
      // 读取响应文本（即使非 200 也要读，用于调试）
      const text = await response.text();
      console.log('[Proxy] Response preview:', text.substring(0, 200));
  
      // 尝试解析 JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('[Proxy] JSON parse failed:', parseError.message);
        return new Response(
          JSON.stringify({
            error: '上游服务返回非 JSON 内容',
            status: response.status,
            rawPreview: text.substring(0, 500),
          }),
          {
            status: 502,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
  
      // 成功返回 JSON
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300', // 可选：缓存 5 分钟
        },
      });
    } catch (error) {
      console.error('[Proxy] Fatal error:', error);
      return new Response(
        JSON.stringify({
          error: '代理服务异常',
          message: error.message || 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  }