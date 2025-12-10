import express from 'express';

const router = express.Router();

router.post('/suggest-response', async (req, res) => {
    const { ticketDescription, comments } = req.body;

    // Mock AI response for now
    // In a real implementation, call OpenAI or Gemini API here
    const mockResponse = `Based on the ticket description "${ticketDescription}", I suggest checking the logs first. If the issue persists, please restart the service.`;

    res.json({ suggestion: mockResponse });
});

export default router;
