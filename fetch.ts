import { writeFileSync } from 'fs';

async function run() {
  const url = 'https://notes-portfolio.preview.emergentagent.com/static/js/bundle.js';
  try {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    writeFileSync('bundle.js', text);
    console.log(`Saved to bundle.js, size: ${text.length}`);
  } catch (e: any) {
    console.error(`Error:`, e.message);
  }
}

run();
