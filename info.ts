import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

const all = walk('src');
for (const f of all) {
  const code = readFileSync(f, 'utf-8');
  const lines = code.split('\n').length;
  console.log(`File: ${f} - Lines: ${lines}`);
}
