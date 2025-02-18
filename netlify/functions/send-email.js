const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { clientName, surveyData } = JSON.parse(event.body);

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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Business English Survey <survey@woburnforum.com>',
        to: 'andrew@woburnforum.com',
        subject: `Survey Results: ${clientName} - ${new Date().toLocaleDateString()}`,
        html: emailContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', data })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error: error.message })
    };
  }
};
