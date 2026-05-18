exports.handler = async function (event) {
  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: "Prompt required" }) };
    if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 500, body: JSON.stringify({ error: "Missing API key" }) };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    console.log("Anthropic response:", JSON.stringify(data));

    if (!response.ok) return { statusCode: response.status, body: JSON.stringify({ error: data.error?.message || "Anthropic error" }) };

    const text = data.content?.[0]?.text;
    if (!text) return { statusCode: 500, body: JSON.stringify({ error: "No text in response", raw: data }) };

    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};