const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const mockEmails = [
  {
    id: '1',
    from: 'noreply@indiapost.gov.in',
    subject: 'GDS Application Submitted Successfully',
    date: 'Sun, 6 Sep 2026 22:19:18 +0530',
    snippet: 'Dear Sowmiya.S, Your application for Gramin Dak Sevak engagement has been successfully submitted.',
  },
  {
    id: '2',
    from: 'careers@chatgpt.com',
    subject: 'Interview Schedule Update',
    date: 'Mon, 7 Sep 2026 10:15:00 +0530',
    snippet: 'Hi Sowmiya, We would like to invite you for a technical discussion regarding your recent application.',
  }
];

app.get('/api/auth/status', (req, res) => res.json({ isAuthenticated: true }));
app.get('/api/emails', (req, res) => res.json({ emails: mockEmails }));

app.post('/api/ai/chat', (req, res) => {
  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: 'User prompt is required' });
  }

  const promptLower = userPrompt.toLowerCase();
  let aiReply = '';

  if (promptLower.includes('summary') || promptLower.includes('summarize')) {
    aiReply = `Summary of your inbox:\n1. GDS Application: Successfully submitted for Gramin Dak Sevak.\n2. ChatGPT Careers: Invitation for technical discussion.`;
  } else if (promptLower.includes('reply') || promptLower.includes('draft')) {
    aiReply = `Draft Reply for ChatGPT Careers:\n\nDear Careers Team,\n\nThank you for reaching out! I would be delighted to attend the technical discussion regarding my application. Please let me know the available time slots.\n\nBest regards,\nSowmiya S`;
  } else if (promptLower.includes('hello') || promptLower.includes('hi')) {
    aiReply = `Hello! I am your Nebula AI Assistant. How can I help you manage your inbox today?`;
  } else {
    aiReply = `Received request: "${userPrompt}". I can help you summarize inbox emails or draft reply messages!`;
  }

  return res.json({ result: aiReply });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Backend server running on http://127.0.0.1:5000');
});