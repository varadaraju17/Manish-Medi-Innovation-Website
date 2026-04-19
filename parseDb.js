const fs = require('fs');

const raw = fs.readFileSync('data_raw.txt', 'utf8');

const products = [];
const blocks = raw.split(/🟦\s*\d+\.\s*/).filter(b => b.trim() !== "");

let currentDepartment = "Urology"; // Fallback

blocks.forEach((block, idx) => {
  const lines = block.split('\n').map(l => l.trim());
  let name = lines[0];
  let cat = "";
  let obj = {
    id: idx + 1,
    department: "",
    name: name,
    overview: "",
    features: [],
    specifications: {},
    applications: [],
    packaging: "",
    components: [],
    image: ""
  };

  let mode = "";

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.startsWith("Category:")) {
      obj.department = line.replace("Category:", "").trim();
      currentDepartment = obj.department.split('/')[0].trim();
      mode = "";
      continue;
    }
    
    if (line.startsWith("Overview:")) {
      mode = "overview";
      continue;
    }
    if (line.startsWith("Key Features:")) {
      mode = "features";
      continue;
    }
    if (line.startsWith("Specifications:")) {
      mode = "specs";
      continue;
    }
    if (line.startsWith("Applications:")) {
      mode = "applications";
      continue;
    }
    if (line.startsWith("Packaging:")) {
      obj.packaging = line.replace("Packaging:", "").trim();
      mode = "";
      continue;
    }
    if (line.startsWith("Components:")) {
      mode = "components";
      continue;
    }
    if (line.startsWith("Types:")) {
      obj.specifications.Types = line.replace("Types:", "").trim();
      if (!obj.specifications.Types) mode = "types_list";
      continue;
    }
    if (line.startsWith("Sizes:")) {
      obj.specifications.Sizes = line.replace("Sizes:", "").trim();
      if (!obj.specifications.Sizes) mode = "sizes_list";
      continue;
    }
    if (line.startsWith("Lengths:") || line.startsWith("Length:")) {
      obj.specifications.Length = line.replace(/Lengths?:/, "").trim();
      continue;
    }

    if (mode === "overview") {
      obj.overview += line + " ";
    } else if (mode === "features") {
      obj.features.push(line);
    } else if (mode === "specs") {
      if (line.includes(":")) {
        const parts = line.split(":");
        obj.specifications[parts[0].trim()] = parts.slice(1).join(":").trim();
      }
    } else if (mode === "applications") {
      obj.applications.push(line);
    } else if (mode === "components") {
      obj.components.push(line);
    } else if (mode === "types_list") {
      if (!obj.specifications.Types) obj.specifications.Types = line;
      else obj.specifications.Types += ", " + line;
    } else if (mode === "sizes_list") {
      if (!obj.specifications.Sizes) obj.specifications.Sizes = line;
      else obj.specifications.Sizes += ", " + line;
    }
  }

  if (!obj.department) obj.department = currentDepartment;
  obj.overview = obj.overview.trim();

  // Try to match up previous images from our specific generated list
  const imgMap = {
    "Ureteric Catheter": "/images/products/Ureteric-Catheter.jpg",
    "Ureteral Access Sheath": "/images/products/Ureteral-Access-Sheath.jpg",
    "Chiba Needle": "/images/products/Chiba-Needle.jpg",
    "Hydrophilic Guide Wire": "/images/products/Hydrophilic-Guide-Wire.jpg",
    "Foley Balloon Catheter": "/images/products/Foley-Balloon-Catheter.jpg",
    "Nephrostomy Drainage Kit (Pigtail)": "/images/products/Nephrostomy-Drainage-Kit.jpg",
    "Pigtail Catheter": "/images/products/Pigtail-Catheter.jpg",
    "Double J Stent": "/images/products/Double-J-Stent.jpg",
    "Amplatz Sheath": "/images/products/Amplatz-Sheath.jpg",
    "Biopsy Gun": "/images/products/Biopsy-Gun.jpg",
    "Biliary Stents – Standard": "/images/products/Biliary-Stents-Standard.jpg",
    "IUI Catheter": "/images/products/IUI-Catheter.jpg",
    "Fascial Dilator Set": "/images/products/Facial-Dilator-Set.jpg"
  };

  if (imgMap[obj.name]) {
    obj.image = imgMap[obj.name];
  }

  products.push(obj);
});

const output = `export const products = ${JSON.stringify(products, null, 2)};\n`;
fs.writeFileSync('src/data/products.js', output);
console.log("Written 66 products to src/data/products.js");
