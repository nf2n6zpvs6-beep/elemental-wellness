exports.handler = async function (event) {
  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" })
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Anthropic error:", JSON.stringify(data));
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "Anthropic request failed",
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.log("Function error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};