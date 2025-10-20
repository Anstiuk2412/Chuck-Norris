const fs = require('fs');
const path = require('path');

function normalizeWhitespace(input) {
  let s = input.replace(/\r\n?/g, '\n');
  s = s.replace(/[\t]/g, ' '); // tabs -> two spaces
  s = s.split('\n').map(line => line.replace(/[ \t]+$/g, '')).join('\n');
  s = s.replace(/\n{3, }/g, '\n\n'); // collapse multiple blank lines

  if (!s.endsWith('\n')) s += '\n';
  return s;
}

function formatCSS(input) {
  let s = normalizeWhitespace(input).trim();
  // Insert structural newlines
  s = s
  .replace(/\s*{\s*/g, ' {\n')
      .replace(/\s*;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n');

      // Tokenize into lines
      let lines = s.split('\n').map(l => l.trim()).filter(Boolean);

      // Ensure each declaration has proper colon spacing and trailing semicolon
      lines = lines.map(l => {
          if (l.includes(':') && !/[;{}]$/.test(l)) l += ';';

          if (l.includes(':') && !l.endsWith('{')) l = l.replace(/\s*:\s*/g, ': ');
            return l;
          });

          // Re-indent by braces
          let indent = 0;
          const out = [];

          for (const l of lines) {
            const t = l.trim();

            if (t.startsWith('}')) indent = Math.max(0, indent - 1);
            out.push('  '.repeat(indent) + t);

            if (t.endsWith('{')) indent += 1;
            }

            // Add blank line between rules after a closing brace
            const spaced = [];

            for (let i = 0; i < out.length; i++) {
              const cur = out[i].trim();
              spaced.push(out[i]);

              if (cur === '}') spaced.push('');
            }

            return normalizeWhitespace(spaced.join('\n'));
          }

          function formatJS(input) {
            const src = normalizeWhitespace(input);
            const lines = src.split('\n');
            let indent = 0;
            const out = [];

            for (let raw of lines) {
              let line = raw.trim();

              if (line === '') { out.push(''); continue; }

              // pre-deindent if line starts with closing token

              if (/^[}\])]/.test(line)) indent = Math.max(0, indent - 1);
              // basic spacing rules
              line = line
              .replace(/, (\S)/g, ', $1')
              .replace(/\b(if|for|while|switch|catch)\(/g, '$1 (')
                  .replace(/\)\{/g, ') {')
                  .replace(/\s{2, }/g, ' ');
                  out.push('  '.repeat(indent) + line);
                  // adjust indent after
                  const opens = (line.match(/[({\[]/g) || []).length;
                        const closes = (line.match(/[)}\]]/g) || []).length;
                        const net = opens - closes;

                        if (net > 0) indent += net;
                      }

                      // Insert blank lines between functions and control blocks
                      const spaced = [];
                      const isBlockStart = s => /^(if|for|while|switch|try|catch|finally|else)\b/.test(s) || /^(export\s+)?(async\s+)?function\b|^class\b/.test(s);

                      function lastNonEmpty() {
                        for (let k = spaced.length - 1; k >= 0; k--) if (spaced[k].trim() !== '') return spaced[k].trim();
                        return '';
                      }

                      for (let i=0;i<out.length;i++) {
                        const cur = out[i];
                        const curTrim = cur.trim();
                        const prev = lastNonEmpty();

                        if (isBlockStart(curTrim) && prev && !prev.endsWith('{')) { if (spaced[spaced.length-1] !== '') spaced.push(''); }

                          if ((prev === '}' || /}\s*;?$/.test(prev)) && !/^(else|catch|finally)\b/.test(curTrim) && curTrim && curTrim !== '}') { if (spaced[spaced.length-1] !== '') spaced.push(''); }

                          spaced.push(cur);
                        }

                        return normalizeWhitespace(spaced.join('\n'));
                      }

                      function isTarget(file) { return /\.(js|css)$/i.test(file); }

                      function walk(dir) {
                        const entries = fs.readdirSync(dir, { withFileTypes: true });

                        for (const e of entries) {
                          const p = path.join(dir, e.name);

                          if (e.isDirectory()) walk(p);

                          else if (isTarget(p)) {
                            const before = fs.readFileSync(p, 'utf8');
                            const after = p.endsWith('.css') ? formatCSS(before) : formatJS(before);

                            if (before !== after) {
                              fs.writeFileSync(p, after, 'utf8');
                              console.log('Formatted', p);
                            }
                          }
                        }
                      }

                      const target = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
                      const stat = fs.statSync(target);

                      if (stat.isDirectory()) walk(target);

                      else if (stat.isFile() && isTarget(target)) {
                        const before = fs.readFileSync(target, 'utf8');
                        const after = target.endsWith('.css') ? formatCSS(before) : formatJS(before);
                        fs.writeFileSync(target, after, 'utf8');
                        console.log('Formatted', target);
                      } else {
                      console.error('No JS/CSS files found at', target);
                      process.exit(1);
                    }

