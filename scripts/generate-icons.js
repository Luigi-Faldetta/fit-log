const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 167, name: 'icon-167x167.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
];

const inputFile = path.join(__dirname, 'client/public/logo.png');
const outputDir = path.join(__dirname, 'client/public/');

console.log('🎨 Generating PWA icons from logo.png...\n');

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`❌ Error: Input file not found: ${inputFile}`);
  process.exit(1);
}

// Generate all icon sizes
const generateIcons = async () => {
  const promises = sizes.map(async ({ size, name }) => {
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(path.join(outputDir, name));
      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (err) {
      console.error(`❌ Error generating ${name}:`, err.message);
      throw err;
    }
  });

  await Promise.all(promises);

  // Generate favicon.ico using sharp
  console.log('\n🔨 Generating favicon.ico...');
  try {
    // Create 32x32 as the main favicon size
    await sharp(inputFile)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(outputDir, 'favicon-32.png'));

    // Rename to .ico (browsers accept PNG format with .ico extension)
    fs.renameSync(
      path.join(outputDir, 'favicon-32.png'),
      path.join(outputDir, 'favicon.ico')
    );
    console.log('✅ Generated favicon.ico (32x32)');
  } catch (err) {
    console.error('❌ Error generating favicon.ico:', err.message);
    throw err;
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Icons have been saved to client/public/');
  console.log('2. Update index.html to use /apple-touch-icon.png and /favicon.ico');
  console.log('3. Update manifest.json with the new icon sizes');
  console.log('4. Update vite.config.js manifest configuration');
};

generateIcons().catch((err) => {
  console.error('\n❌ Icon generation failed:', err);
  process.exit(1);
});
