// netlify/functions/proxy.js
export async function handler(event, context) {
    // 1. 获取原始查询参数（如 ?ope=old&size=10&on=20251024205700）
    const { queryStringParameters = {} } = event;
    const search = new URLSearchParams(queryStringParameters).toString();
  
    // 2. 构造目标 URL
    const targetUrl = `https://push.chsi.com.cn/category.do?${search}`;
  
    try {
      // 3. 转发请求到学信网
      const response = await fetch(targetUrl);
  
      // 4. 返回原始 JSON 数据（带 CORS 头）
      const data = await response.json();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // 允许任何前端调用（生产环境可限制为你的域名）
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      console.error('Proxy error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '代理请求失败' }),
      };
    }
  }