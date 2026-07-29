import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function run() {
  const code = readFileSync('bundle.js', 'utf-8');
  console.log("Reading bundle...");

  // Instead of exact index math, let's seek the marker
  const marker = '/***/ "./src/';
  let index = 0;
  let count = 0;

  while (true) {
    index = code.indexOf(marker, index);
    if (index === -1) break;

    // Find the quotes around the path
    const startQuoteIdx = code.indexOf('"', index);
    const endQuoteIdx = code.indexOf('"', startQuoteIdx + 1);
    
    if (startQuoteIdx === -1 || endQuoteIdx === -1) {
      index += 1;
      continue;
    }

    const rawPath = code.substring(startQuoteIdx + 1, endQuoteIdx);
    console.log(`Discovered path: ${rawPath}`);

    // Now find the block structure starting right after the end quote
    // Webpack defines module as:
    // (module, __webpack_exports__, __webpack_require__) { CODE }
    // We can search for the next '{'
    const openBraceIdx = code.indexOf('{', endQuoteIdx);
    if (openBraceIdx === -1 || openBraceIdx > endQuoteIdx + 500) {
      index = endQuoteIdx + 1;
      continue;
    }

    // Now let's find where this module ends.
    // It ends either at the next /***/ marker or at the end of the modules structure
    let nextMarkerIdx = code.indexOf('/***/ "', openBraceIdx);
    let potentialEndIdx = code.indexOf('\n\n/***/ }', openBraceIdx);
    
    let blockEnd = nextMarkerIdx;
    if (blockEnd === -1 || (potentialEndIdx !== -1 && potentialEndIdx < blockEnd)) {
      blockEnd = potentialEndIdx;
    }
    if (blockEnd === -1) {
      blockEnd = code.length;
    }

    let moduleCode = code.substring(openBraceIdx + 1, blockEnd);

    // Clean up trailing Webpack braces and Hot Module Reload (HMR) runtime registrations from the ends of files
    const lastBraceIdx = moduleCode.lastIndexOf('}');
    if (lastBraceIdx !== -1) {
      moduleCode = moduleCode.substring(0, lastBraceIdx);
    }

    const targetFile = rawPath.replace('./src/', 'src/');
    if (targetFile.trim() && targetFile.startsWith('src/')) {
      console.log(`Restoring ${targetFile}...`);
      const folder = dirname(targetFile);
      mkdirSync(folder, { recursive: true });
      writeFileSync(targetFile, moduleCode.trim());
      count++;
    }

    index = blockEnd;
  }

  console.log(`Successfully restored ${count} modules!`);
}

run();
