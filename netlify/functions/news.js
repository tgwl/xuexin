// netlify/functions/news.js
export async function handler(event, context) {
  const { queryStringParameters = {} } = event;
  const search = new URLSearchParams(queryStringParameters).toString();
  const targetUrl = `https://push.chsi.com.cn/category.do?${search}`;

  console.log('【代理请求】目标 URL:', targetUrl); // ← 关键日志

  try {
    // 添加 User-Agent 避免被拦截
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Netlify Function; +https://xuexin.netlify.app)',
        'Accept': 'application/json, text/plain, */*',
      },
      redirect: 'follow',
    });

    console.log('【上游响应】状态码:', response.status); // ← 关键日志

    // 即使状态码不是 200，也要读取 body
    const text = await response.text();
    console.log('【上游响应】原始内容前200字符:', text.substring(0, 200)); // ← 关键日志

    // 尝试解析 JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('【JSON解析失败】', parseError.message);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: '上游返回非 JSON 数据',
          raw: text.substring(0, 500), // 返回部分原始内容用于调试
        }),
      };
    }

    // 成功返回
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('【函数异常】', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: '代理请求异常',
        message: error.message,
      }),
    };
  }
}