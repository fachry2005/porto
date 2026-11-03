const fs = require('fs');

// Simple PNG parser to get width and height
function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  // Check PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47) {
    console.log('Not a valid PNG file');
    return;
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  console.log(`Dimensions: ${width}x${height}`);
}

getPngDimensions('c:\\Users\\FACHRY\\porto\\public\\assets\\CARD.png');
