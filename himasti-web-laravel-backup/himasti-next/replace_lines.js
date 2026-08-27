const fs = require('fs');

const content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');
const lines = content.split('\n');

const replacementLines = fs.readFileSync('replacement.txt', 'utf8').split('\n');

// We want to replace lines 101 to 124 (0-indexed 100 to 123)
lines.splice(100, 24, ...replacementLines);

fs.writeFileSync('src/app/LandingAnimation.tsx', lines.join('\n'));
