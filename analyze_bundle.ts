import { readFileSync } from 'fs';

function run() {
  const code = readFileSync('extracted_portfolio_core.txt', 'utf-8');
  const lines = code.split('\n');
  
  console.log("Searching file signatures...");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('/***/ "./src/')) {
      console.log(`Line ${i + 1}: ${line}`);
    }
  }
}

run();
