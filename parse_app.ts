import { readFileSync } from 'fs';

function run() {
  const code = readFileSync('extracted_app_js.txt', 'utf-8');
  
  // Find where the chunk says App.jsx or App.js
  let idx = code.indexOf('"./src/App.jsx"');
  if (idx === -1) idx = code.indexOf('"./src/App.js"');
  
  if (idx !== -1) {
    console.log("App file header found at position:", idx);
    const text = code.substring(idx - 100, idx + 10000);
    console.log("Extracted first 10000 characters of App file:");
    console.log(text);
  } else {
    console.log("App file header not found directly, let's print first 3000 chars:");
    console.log(code.substring(0, 3000));
  }
}

run();
