/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // API configurations with fallback order
    const API_CONFIGS = [
      {
        name: "Gemini 2.0 Flash",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY_V2}`,
        key: env.GEMINI_API_KEY_V2
      },
      {
        name: "Gemini 1.5 Flash",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY_V2}`,
        key: env.GEMINI_API_KEY_V2
      },
      {
        name: "Gemini 1.0 Pro",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${env.GEMINI_API_KEY_V2}`,
        key: env.GEMINI_API_KEY_V2
      }
    ];

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { 
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Parse the incoming request body
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response("Invalid JSON", { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (!body.message) {
      return new Response("Message is required", { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Debug: Check if API key is available
    if (!env.GEMINI_API_KEY_V2) {
      console.error("GEMINI_API_KEY_V2 is not set");
      return new Response(JSON.stringify({ 
        error: "API key not configured", 
        details: "GEMINI_API_KEY_V2 environment variable is missing"
      }), { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Try each API configuration in order
    for (let i = 0; i < API_CONFIGS.length; i++) {
      const config = API_CONFIGS[i];
      console.log(`Trying API ${i + 1}/${API_CONFIGS.length}: ${config.name}`);
      
      try {
        const geminiRes = await fetch(config.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: body.message }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
          
          console.log(`Success with ${config.name}`);
          return new Response(JSON.stringify({ 
            answer: responseText,
            original: geminiData,
            model: config.name
          }), {
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        } else {
          const errorText = await geminiRes.text();
          console.error(`${config.name} failed with status ${geminiRes.status}:`, errorText);
          
          // If it's a quota/limit error, try the next API
          if (geminiRes.status === 429 || geminiRes.status === 403) {
            console.log(`Quota/limit reached for ${config.name}, trying next API...`);
            continue;
          }
          
          // For other errors, throw to be caught by outer catch
          throw new Error(`${config.name} error: ${errorText}`);
        }
      } catch (error) {
        console.error(`Error with ${config.name}:`, error.message);
        
        // If this is the last API, return error
        if (i === API_CONFIGS.length - 1) {
          return new Response(JSON.stringify({ 
            error: "All APIs failed", 
            details: error.message 
          }), { 
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
        
        // Otherwise, continue to next API
        console.log(`Continuing to next API...`);
      }
    }
  }
}
