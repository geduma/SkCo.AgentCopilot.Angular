module.exports = async function (context, req) {
  const apiKey = process.env.OLLAMA_API_KEY;
  
  context.log('Proxy request to Ollama');

  const response = await fetch('https://api.ollama.com/v1/generate', {
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
      'Content-Type': 'application/json'
    }
  };
};