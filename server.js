const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;

const server = http.createServer((req, res) => {
  // Serve the HTML file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Cloudinary Test Server running at http://localhost:${PORT}`);
  console.log('✅ Ready to test Cloudinary uploads!');
});
