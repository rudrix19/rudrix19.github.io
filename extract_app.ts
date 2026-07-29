import { readFileSync, writeFileSync } from 'fs';

function run() {
  const code = readFileSync('bundle.js', 'utf-8');
  
  // Find where the App.js module definition starts before 2494517
  // Let's search for "./src/App.js" or "./src/App.jsx" near that index
  const matchIdx = 2494517;
  const startIdx = code.lastIndexOf('(__unused_webpack_module', matchIdx);
  const endIdx = code.indexOf('/***/ }', matchIdx);
  
  if (startIdx !== -1 && endIdx !== -1) {
    const chunk = code.substring(startIdx, endIdx);
    writeFileSync('extracted_app_js.txt', chunk);
    console.log(`Saved App.js content between ${startIdx} and ${endIdx} to extracted_app_js.txt`);
  } else {
    const chunk = code.substring(matchIdx - 1000, matchIdx + 8000);
    writeFileSync('extracted_app_js.txt', chunk);
    console.log(`Saved backup window to extracted_app_js.txt`);
  }
}

run();
