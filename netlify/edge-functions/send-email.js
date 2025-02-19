export default async function handler(request, context) {
  console.log('Edge function called');

  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
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
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const { clientName, surveyData } = await request.json();
    console.log('Received request for client:', clientName);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('Resend API key not found in environment');
      throw new Error('Resend API key not configured');
    }

    const emailContent = `
      <h1>Business English Survey Report</h1>
      <h2>Client: ${clientName}</h2>
      <h3>Survey Results:</h3>
      ${Object.entries(surveyData).map(([section, responses]) => `
        <h4>${section}</h4>
        <ul>
          ${Object.entries(responses).map(([skill, rating]) => `
            <li><strong>${skill}:</strong> ${rating}</li>
          `).join('')}
        </ul>
      `).join('')}
      <p>Generated on ${new Date().toLocaleString()}</p>
    `;

    console.log('Sending request to Resend API...');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Business English Survey <survey@woburnforum.com>',
        to: 'andrew@woburnforum.com',
        subject: `Survey Results: ${clientName} - ${new Date().toLocaleDateString()}`,
        html: emailContent
      })
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    const data = await response.json();
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
    console.error('Error in edge function:', error);
    return new Response(JSON.stringify({ 
      message: error.message || 'Internal server error',
      error: error.toString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 500
    });
  }
}
