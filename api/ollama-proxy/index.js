module.exports = async function (context, req) {
  context.log('Ollama proxy called');

  const apiKey = '083373c776a148ea8767c7d570d60a97.85dGMVkv3RJTLKOA7TSLE-Eh';
  const ollamaUrl = 'https://api.ollama.com/v1/generate';

  try {
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.text();

    context.res = {
      status: response.status,
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (err) {
    context.log.error('Error:', err.message);
    context.res = {
      status: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};