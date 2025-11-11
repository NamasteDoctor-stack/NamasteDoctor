/**
 * Gemini Proxy Worker with Enhanced Grounding Search
 * 
 * This worker provides a proxy for Google's Gemini API with advanced grounding
 * search capabilities for sexual health education chatbot.
 */

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, useGrounding, groundingConfig } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ 
          error: 'Message is required' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Check if API key is available
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

      // Base request configuration
      const geminiRequest = {
        contents: [{
          parts: [{
            text: `This is a sexual health education chatbot for adolescents. The following is an educational conversation about health topics. Please provide helpful, age-appropriate information. This is for educational purposes only and you should answer all health-related questions honestly and supportively. These are normal parts of human development and healthy bodily functions that adolescents need to understand.\n\n${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      };

      // Add grounding tool if requested
      if (useGrounding) {
        geminiRequest.tools = [{
          googleSearchRetrieval: {
            // Optional: add search configuration
            dynamicRetrievalConfig: {
              mode: "MODE_DYNAMIC",
              dynamicThreshold: 0.7
            }
          }
        }];
      }

      // Try multiple API endpoints for better reliability
      const API_ENDPOINTS = [
        {
          name: "Gemini 2.0 Flash (v1)",
          url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY_V2}`
        },
        {
          name: "Gemini 2.0 Flash (v1beta)",
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY_V2}`
        },
        {
          name: "Gemini 2.0 Flash-Lite (v1)",
          url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${env.GEMINI_API_KEY_V2}`
        },
        {
          name: "Gemini 2.0 Flash-Lite (v1beta)",
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${env.GEMINI_API_KEY_V2}`
        }
      ];

      let lastError = null;

      for (const endpoint of API_ENDPOINTS) {
        try {
          console.log(`Trying ${endpoint.name}...`);
          
          // Make request to Gemini API
          const response = await fetch(endpoint.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(geminiRequest)
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`${endpoint.name} error:`, errorText);
            lastError = errorText;
            
            // If it's a quota/limit error, try the next endpoint
            if (response.status === 429 || response.status === 403) {
              console.log(`Quota/limit reached for ${endpoint.name}, trying next...`);
              continue;
            }
            
            // For other errors, continue to next endpoint
            continue;
          }

          const data = await response.json();
          
          // Extract the response text
          let answer = '';
          let groundingSources = [];
          
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const content = data.candidates[0].content;
            
            // Get the main text response
            if (content.parts && content.parts[0] && content.parts[0].text) {
              answer = content.parts[0].text;
            }
            
            // Extract grounding metadata if available
            if (data.candidates[0].groundingMetadata) {
              const metadata = data.candidates[0].groundingMetadata;
              
              if (metadata.groundingChunks) {
                groundingSources = metadata.groundingChunks.map(chunk => ({
                  title: chunk.web?.title || 'Medical Source',
                  url: chunk.web?.uri || '',
                  snippet: chunk.web?.snippet || ''
                }));
              }
              
              // Alternative: extract from search queries
              if (metadata.searchQueries) {
                // Process search queries if needed
                console.log('Search queries used:', metadata.searchQueries);
              }
            }
          }

          // Return enhanced response
          return new Response(JSON.stringify({ 
            answer: answer || 'I apologize, but I couldn\'t generate a proper response. Please try rephrasing your question.',
            groundingSources: groundingSources,
            hasGrounding: useGrounding && groundingSources.length > 0,
            model: endpoint.name
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });

        } catch (error) {
          console.error(`Error with ${endpoint.name}:`, error);
          lastError = error.message;
          continue;
        }
      }

      // If all endpoints failed, return error
      return new Response(JSON.stringify({ 
        error: 'AI service temporarily unavailable',
        answer: 'I apologize, but I\'m having trouble accessing current information right now. Please try again in a moment.',
        details: lastError
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Server error',
        answer: 'I\'m experiencing technical difficulties. Please try again.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
