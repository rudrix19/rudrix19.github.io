import { readFileSync } from 'fs';

function run() {
  const files = [
    'src/pages/Home.jsx',
    'src/pages/Projects.jsx',
    'src/pages/IISER.jsx',
    'src/pages/School.jsx',
    'src/components/Footer.jsx',
    'src/components/Navbar.jsx'
  ];

  for (const f of files) {
    try {
      const code = readFileSync(f, 'utf-8');
      console.log(`=== ANALYZING ${f} ===`);
      
      // We look for where array declarations start and search for closing brackets roughly
      // e.g. "const projects = [" or "const socials = [" etc.
      const lines = code.split('\n');
      let insideArray = false;
      let arrayName = '';
      let arrayBuild: string[] = [];
      let braceCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!insideArray) {
          const match = line.match(/(const|let|var)\s+(\w+)\s*=\s*\[/);
          if (match) {
            insideArray = true;
            arrayName = match[2];
            arrayBuild = [line];
            braceCount = 1; // open square bracket
          }
        } else {
          arrayBuild.push(line);
          const opens = (line.match(/\[/g) || []).length;
          const closes = (line.match(/\]/g) || []).length;
          braceCount += opens - closes;
          if (braceCount <= 0) {
            insideArray = false;
            console.log(`--- Array '${arrayName}' found (lines ${i - arrayBuild.length + 2} to ${i + 1}): ---`);
            console.log(arrayBuild.join('\n'));
            console.log('');
          }
        }
      }
    } catch (e) {
      console.log(`Error reading ${f}:`, e);
    }
  }
}

run();
