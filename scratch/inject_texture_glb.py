import struct
import os
import sys
import io

try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

glb_path = r"c:\Users\FACHRY\porto\public\assets\kartu.glb"
card_path = r"c:\Users\FACHRY\porto\public\assets\Foto Fachry.jpeg"

# Read GLB file
with open(glb_path, 'rb') as f:
    data = f.read()

# Parse GLB header
magic = struct.unpack_from('<I', data, 0)[0]
version = struct.unpack_from('<I', data, 4)[0]
total_length = struct.unpack_from('<I', data, 8)[0]

print(f"GLB version: {version}, total length: {total_length}")

# First chunk = JSON
json_chunk_length = struct.unpack_from('<I', data, 12)[0]
json_chunk_type = struct.unpack_from('<I', data, 16)[0]
json_start = 20
json_end = json_start + json_chunk_length
json_str = data[json_start:json_end].decode('utf-8')

import json
gltf = json.loads(json_str)

print("Images in GLTF:", gltf.get('images', []))
print("BufferViews count:", len(gltf.get('bufferViews', [])))

# Second chunk = BIN
bin_chunk_offset = json_end
bin_chunk_length = struct.unpack_from('<I', data, bin_chunk_offset)[0]
bin_chunk_type = struct.unpack_from('<I', data, bin_chunk_offset + 4)[0]
bin_start = bin_chunk_offset + 8
bin_end = bin_start + bin_chunk_length

print(f"BIN chunk length: {bin_chunk_length}")

# The image is bufferView 12 (index from earlier inspection)
img_bufferView_index = gltf['images'][0].get('bufferView', 12)
bv = gltf['bufferViews'][img_bufferView_index]

img_offset = bv['byteOffset']
img_length = bv['byteLength']

print(f"Image bufferView {img_bufferView_index}: offset={img_offset}, length={img_length}")

# Load original embedded image to get its dimensions
orig_img_bytes = data[bin_start + img_offset: bin_start + img_offset + img_length]
orig_img = Image.open(io.BytesIO(orig_img_bytes))
print(f"Original embedded image size: {orig_img.size}")

# Load our new CARD.png and resize to match original embedded image dimensions
new_card = Image.open(card_path).convert('RGB')
new_card_resized = new_card.resize(orig_img.size, Image.Resampling.LANCZOS)

# Save new card as PNG bytes
new_img_buf = io.BytesIO()
new_card_resized.save(new_img_buf, format='PNG', optimize=False)
new_img_bytes = new_img_buf.getvalue()
new_img_length = len(new_img_bytes)

print(f"New image size: {new_img_length} bytes (old: {img_length})")

# Rebuild the BIN chunk with new image
old_bin = data[bin_start:bin_end]
old_bin = bytearray(old_bin)

# Replace old image bytes with new image bytes (if same size or smaller; otherwise we need to pad)
new_bin = bytearray()
new_bin += old_bin[:img_offset]  # data before the image
new_bin += new_img_bytes          # new image
# Pad to original image size if smaller; if larger, this is more complex
if new_img_length < img_length:
    new_bin += bytes(img_length - new_img_length)  # zero padding
elif new_img_length > img_length:
    # Update bufferView to reflect new size and update all subsequent bufferViews' offsets
    size_diff = new_img_length - img_length
    gltf['bufferViews'][img_bufferView_index]['byteLength'] = new_img_length
    # Shift all bufferViews that come after
    for i, bv2 in enumerate(gltf['bufferViews']):
        if i != img_bufferView_index and bv2.get('byteOffset', 0) > img_offset:
            bv2['byteOffset'] += size_diff
    # Update buffer byte length
    gltf['buffers'][0]['byteLength'] += size_diff
    
new_bin += old_bin[img_offset + img_length:]  # data after the image

# Align to 4 bytes
while len(new_bin) % 4 != 0:
    new_bin += b'\x00'

# Rebuild JSON chunk (gltf may have been updated)
new_json_str = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
while len(new_json_str) % 4 != 0:
    new_json_str += b' '

# Build new GLB
new_glb = bytearray()
# Header
new_total_length = 12 + 8 + len(new_json_str) + 8 + len(new_bin)
new_glb += struct.pack('<I', 0x46546c67)  # magic
new_glb += struct.pack('<I', 2)           # version
new_glb += struct.pack('<I', new_total_length)

# JSON chunk
new_glb += struct.pack('<I', len(new_json_str))
new_glb += struct.pack('<I', 0x4E4F534A)  # JSON
new_glb += new_json_str

# BIN chunk
new_glb += struct.pack('<I', len(new_bin))
new_glb += struct.pack('<I', 0x004E4942)  # BIN
new_glb += new_bin

with open(glb_path, 'wb') as f:
    f.write(new_glb)

print(f"Done! New GLB written: {len(new_glb)} bytes")
print("The kartu.glb file now contains your photo!")
