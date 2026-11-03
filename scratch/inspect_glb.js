const fs = require('fs');

function inspectGlb(filePath) {
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546c67) {
    console.log('Not a valid GLB file');
    return;
  }
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  console.log(`GLB Version: ${version}, Length: ${length} bytes`);

  // First chunk is JSON
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.readUInt32LE(16);
  if (chunkType !== 0x4E4F534A) {
    console.log('First chunk is not JSON');
    return;
  }

  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);
  
  console.log('Images in GLTF:');
  if (gltf.images) {
    gltf.images.forEach((img, idx) => {
      console.log(`Image ${idx}:`, img);
    });
  } else {
    console.log('No images array in GLTF');
  }

  console.log('Textures in GLTF:');
  if (gltf.textures) {
    gltf.textures.forEach((tex, idx) => {
      console.log(`Texture ${idx}:`, tex);
    });
  }

  console.log('Materials in GLTF:');
  if (gltf.materials) {
    gltf.materials.forEach((mat, idx) => {
      console.log(`Material ${idx}:`, mat);
    });
  }
}

inspectGlb('c:\\Users\\FACHRY\\porto\\public\\assets\\kartu.glb');
