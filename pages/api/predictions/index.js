export default async function handler(req, res) {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Pinned to a specific version of qwen-vl-chat
        // See https://replicate.com/lucataco/qwen-vl-chat
        version: process.env.MODEL_CODE,
  
        // This is the text prompt that will be submitted by a form on the frontend
        input: {
            image: req.body.image,
            prompt: req.body.prompt
        },
      }),
    });
  
    if (response.status !== 201) {
      let error = await response.json();
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }
  
    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }