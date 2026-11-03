const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
  // Decode URL in case of spaces like "Foto Fachry.jpeg"
  let decodedUrl = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, decodedUrl);
  
  if (req.url === '/' || req.url === '/scratch/analyze_and_generate.html') {
    filePath = path.join(ROOT, 'scratch', 'analyze_and_generate.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found: ' + filePath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.js') contentType = 'application/javascript';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
