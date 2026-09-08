import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock AI Endpoint for Nebula Mail
app.post('/api/ai/generate', (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Simulated AI email completion response
  const mockResponse = `Subject: Re: Follow up\n\nHi there,\n\nThank you for reaching out regarding "${prompt}". I've reviewed the details and everything looks good on my end.\n\nBest regards,\nNebula Mail AI Assistant`;

  setTimeout(() => {
    res.json({ text: mockResponse });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
