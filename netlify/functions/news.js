// netlify/functions/news.js
export async function handler(event, context) {
  const { queryStringParameters = {} } = event;
  const search = new URLSearchParams(queryStringParameters).toString();
  const targetUrl = `https://push.chsi.com.cn/category.do?${search}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '代理失败' }),
    };
  }
}