// Simple Express server for local testing. For Vercel static deployment you don't need this file.
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));