export default async function handler(request, context) {
  console.log('Edge function called with method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));

  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  if (request.method !== 'POST') {
    console.log('Invalid method:', request.method);
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const body = await request.text();
    console.log('Raw request body:', body);
    
    const { clientName, surveyData } = JSON.parse(body);
    console.log('Parsed request data - Client:', clientName);
    console.log('Survey data:', JSON.stringify(surveyData, null, 2));

    // Get API key from context.env instead of Deno.env
    const resendApiKey = context.env.RESEND_API_KEY;
    console.log('API Key exists:', !!resendApiKey);
    
    if (!resendApiKey) {
      console.error('Resend API key not found in environment');
      throw new Error('Resend API key not configured');
    }

    const emailContent = `
      <h1>Business English Survey Report</h1>
      <h2>Client: ${clientName}</h2>
      <h3>Survey Results:</h3>
      <pre>${JSON.stringify(surveyData, null, 2)}</pre>
      <p>Generated on ${new Date().toLocaleString()}</p>
    `;

    console.log('Preparing to send email...');
    const emailRequest = {
      from: 'Business English Survey <survey@woburnforum.com>',
      to: 'andrew@woburnforum.com',
      subject: `Survey Results: ${clientName} - ${new Date().toLocaleDateString()}`,
      html: emailContent
    };
    console.log('Email request:', JSON.stringify(emailRequest, null, 2));

    console.log('Sending request to Resend API...');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailRequest)
    });

    const responseText = await response.text();
    console.log('Resend API raw response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText };
      }
      console.error('Resend API error:', errorData);
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = JSON.parse(responseText);
    console.log('Resend API response:', data);

    return new Response(JSON.stringify({ 
      message: 'Email sent successfully',
      data 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    });

  } catch (error) {
    console.error('Error in edge function:', error.stack || error);
    return new Response(JSON.stringify({ 
      message: 'Failed to send email',
      error: error.message,
      stack: error.stack
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 500
    });
  }
}
