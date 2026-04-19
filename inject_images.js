const fs = require('fs');

// Load existing products
const content = fs.readFileSync('src/data/products.js', 'utf8');
let products = eval(content.replace('export const products =', 'const products =')); // Simple eval for Node
// Actually parse properly
const productsData = require('./src/data/products').products;

// Image mapping: product name -> public path
const imageMap = {
  "Introducer Needle": "/images/products/Introducer-Needle.jpg",
  "IP Needle (Initial Puncture)": "/images/products/IP-Needle.jpg",
  "I.P Needle (Initial Puncture)": "/images/products/IP-Needle.jpg",
  "Hydro Twister Guide Wire": "/images/products/Hydro-Twister-Guide-Wire.jpg",
  "Lunderquist Guide Wire": "/images/products/Lunderquist-Guide-Wire.jpg",
  "PTFE Guide Wire (SS)": "/images/products/PTFE-Guide-Wire.jpg",
  "Amplatz Renal Dilator Kit (Renal Dilator Set)": "/images/products/Amplatz-Renal-Dilator-Kit.jpg",
  "Facial Dilator Set": "/images/products/Amplatz-Renal-Dilator-Kit.jpg",
  "Filiform Dilator": "/images/products/Filiform-Dilator.jpg",
  "Metal Dilator": "/images/products/Metal-Dilator.jpg",
  "Metal Telescopic Dilator": "/images/products/Metal-Telescopic-Dilator.jpg",
  "Nephrotrac Balloon Dilator (Catheter)": "/images/products/Nephrotrac-Balloon-Dilator.jpg",
  "Nottingham One-Step Dilator (Catheter)": "/images/products/Nottingham-One-Step-Dilator.jpg",
  "Screw Dilator": "/images/products/Screw-Dilator.jpg",
  "Ureteral Balloon Dilator (Catheter)": "/images/products/Ureteral-Balloon-Dilator.jpg",
  "Ureteral Dilator Set": "/images/products/Ureteral-Dilator-Set.jpg",
  "Urethral Dilator": "/images/products/Urethral-Dilator.jpg",
  "S Shape Dilator": "/images/products/S-Shape-Dilator.jpg",
  "Ellicks Evacuator (Bladder Evacuator)": "/images/products/Ellicks-Evacuator.jpg",
};

// Update products with new image paths
const updated = productsData.map(p => {
  if (imageMap[p.name] && !p.image) {
    return { ...p, image: imageMap[p.name] };
  }
  return p;
});

const output = `export const products = ${JSON.stringify(updated, null, 2)};\n`;
fs.writeFileSync('src/data/products.js', output);

const count = updated.filter(p => p.image).length;
console.log(`Updated products.js: ${count}/${updated.length} products now have images.`);
