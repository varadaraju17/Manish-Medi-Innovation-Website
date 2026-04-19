const fs = require('fs');

const { products: oldProducts } = require('./src/data/products');

const structure = [
  {
    main: "UROLOGY",
    subs: [
      { name: "Access Products", items: ["Ureteric Catheter", "Ureteral Access Sheath", "Chiba Needle", "Introducer Needle", "I.P Needle (Initial Puncture)", "Hydro Twister Guide Wire", "Hydrophilic Guide Wire", "Lunderquist Guide Wire", "PTFE Guide Wire (SS)"] },
      { name: "Accessories", items: ["Ellicks Evacuator (Bladder Evacuator)", "Path Finder (Track Finder)", "Penile Clamp", "TUR Set", "Cysto Bridge", "TURP Set", "Bugbee Electrodes", "TURP Loops and Electrodes"] },
      { name: "Dilation Products", items: ["Amplatz Renal Dilator Kit (Renal Dilator Set)", "Amplatz Sheath", "Facial Dilator Set", "Filiform Dilator", "Metal Dilator", "Metal Telescopic Dilator", "Nephrotrac Balloon Dilator (Catheter)", "Nottingham One-Step Dilator (Catheter)", "Screw Dilator", "Ureteral Balloon Dilator (Catheter)", "Ureteral Dilator Set", "Urethral Dilator", "S Shape Dilator"] },
      { name: "Drainage Products", items: ["Foley Balloon Catheter (Latex and Silicon)", "Nephrostomy Drainage Kit (Pigtail)", "Malecot Nephrostomy Kit", "Nephrostomy Tube", "Percutaneous Nephrostomy Pigtail Catheter", "Pigtail Nephrostomy Drainage Catheter with Trocar (PCN)", "Pigtail Catheters with Safety Mechanism", "Re-Entry Malecot Catheter", "Malecot Nephrostomy Catheter", "Suprapubic Malecot Catheter", "Suprapubic Cystostomy Kit", "Suprapubic Drainage Kit with Silicone Balloon Catheter", "Ureteral Double J Stent with Pulling String", "Double J Stent", "Urethral Stent"] },
      { name: "Stone Management", items: ["Biopsy Forceps", "Grasping Forcep (URS and Cystoscopy)", "PCNL Forceps", "Stone Grasping Forcep", "Biprong Forcep", "Stone Retrieval Basket (SS)", "Stone Basket", "Perc (PCNL) Basket", "Stone Retrieval Basket (Nitinol)"] }
    ]
  },
  {
    main: "INTERVENTIONAL RADIOLOGY",
    subs: [
      { name: "Access Products", items: ["IP Needle (Initial Puncture)", "Chiba Needle", "Introducer Needle", "Hydro Twister Guide Wire", "Hydrophilic Guide Wire", "Lunderquist Guide Wire", "PTFE Guide Wire (SS)"] },
      { name: "Dilation Products", items: ["Facial Dilator Set", "Double Step Dilator", "Balloon Dilator (Catheter)", "Tube Cannulation Kit"] },
      { name: "Drainage Products", items: ["Abscess Drainage Kit", "Abscess Drainage Catheter with Trocar", "Abscess Drainage Catheter", "Naso Jejunal Feeding Tube", "Abscess Drainage Malecot Catheter", "Abscess Malecot Drainage Kit", "Abscess Drainage Kit (Pigtail)", "Pigtail Catheters with Safety Mechanism", "PTBD Set", "Abscess Drainage Suprapubic Malecot Catheter", "PTBD Catheter"] },
      { name: "Biopsy Devices", items: ["Biopsy Gun", "Biopsy Needle", "Biopsy Instrument"] }
    ]
  },
  {
    main: "GASTROENTEROLOGY",
    subs: [
      { name: "Drainage Products", items: ["Biliary Stents – Standard", "Biliary Stents – Amsterdam", "Biliary Stents – Single Pigtail", "Biliary Stents – Double Pigtail", "Biliary Stents – Straight", "Biliary Stents – Pancreatic", "Naso Biliary Drainage Catheter (NBDC)", "Abscess Drainage Sets – Pigtail Type", "Abscess Drainage Sets – Malecot Type"] },
      { name: "Access Products", items: ["I.P Needle (Initial Puncture)", "Chiba Needle", "Introducer Needle", "Hydro Twister Guide Wire", "Hydrophilic Guide Wire", "PTFE Guide Wire (SS)", "Sclerotherapy Needle"] }
    ]
  },
  {
    main: "GYNAECOLOGY",
    items: ["IUI Catheter", "SSG Device"]
  },
  {
    main: "NEPHROLOGY",
    items: ["CVC Triple Lumen Catheter", "Femoral Catheter", "Guide Wire", "Hemodialysis Catheter", "Introducer Needle"]
  }
];

const newProducts = [];
let nextId = 1;

function clean(name) {
  return name.toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
}

structure.forEach(mainCat => {
  if (mainCat.subs) {
    mainCat.subs.forEach(subCat => {
      subCat.items.forEach(itemName => {
        // Find in old data
        const old = oldProducts.find(p => clean(p.name) === clean(itemName) || clean(itemName).includes(clean(p.name)) || clean(p.name).includes(clean(itemName)));
        
        newProducts.push({
          id: nextId++,
          mainTab: mainCat.main,
          subTab: subCat.name,
          name: itemName,
          overview: old ? old.overview : `Detailed technical overview for ${itemName}.`,
          features: old ? old.features : ["High clinical precision", "Sterile and single-use", "Premium biocompatible material"],
          specifications: old ? old.specifications : {},
          applications: old ? old.applications : [],
          image: old ? old.image : ""
        });
      });
    });
  } else if (mainCat.items) {
    mainCat.items.forEach(itemName => {
      const old = oldProducts.find(p => clean(p.name) === clean(itemName) || clean(itemName).includes(clean(p.name)) || clean(p.name).includes(clean(itemName)));
      newProducts.push({
        id: nextId++,
        mainTab: mainCat.main,
        subTab: "",
        name: itemName,
        overview: old ? old.overview : `Detailed technical overview for ${itemName}.`,
        features: old ? old.features : ["High clinical precision", "Sterile and single-use", "Premium biocompatible material"],
        specifications: old ? old.specifications : {},
        applications: old ? old.applications : [],
        image: old ? old.image : ""
      });
    });
  }
});

const output = `export const products = ${JSON.stringify(newProducts, null, 2)};\n`;
fs.writeFileSync('src/data/products.js', output);
console.log(`Structured ${newProducts.length} products with main/sub mapping.`);
