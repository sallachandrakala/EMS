import express from 'express';

const app = express();
const port = 5002;

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', port });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Accessible at http://localhost:${port}/test`);
});
