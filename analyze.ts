import { readFileSync, writeFileSync } from 'fs';

function cleanAndExtract(fileName: string): string {
  const html = readFileSync(fileName, 'utf-8');
  let textContent = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return textContent;
}

function run() {
  const files = [
    'https___sites_google_com_view_notesfromthenoise_rudrix19_projects.html',
    'https___sites_google_com_view_notesfromthenoise_rudrix19_at_iiser_pune.html',
    'https___sites_google_com_view_notesfromthenoise_rudrix19_at_school.html'
  ];

  for (const file of files) {
    const text = cleanAndExtract(file);
    const outFile = file.replace('.html', '_text.txt');
    writeFileSync(outFile, text);
    console.log(`Extracted ${file} text length: ${text.length} -> Saved to ${outFile}`);
  }
}

run();
