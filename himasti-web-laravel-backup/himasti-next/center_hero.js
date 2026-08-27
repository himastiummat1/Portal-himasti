const fs = require('fs');
let content = fs.readFileSync('src/app/LandingAnimation.tsx', 'utf8');

// Change section layout from side-by-side to stacked and centered
content = content.replace(
  'className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 pt-24 lg:pt-0 max-w-7xl mx-auto gap-12"',
  'className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 max-w-5xl mx-auto gap-12"'
);

// Center the text typography
content = content.replace(
  'className="flex-1 flex flex-col items-start justify-center z-10 w-full"',
  'className="flex flex-col items-center justify-center z-10 w-full"'
);

// Center paragraph
content = content.replace(
  'className="text-lg md:text-xl text-gray-500 max-w-lg mb-10 leading-relaxed"',
  'className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed mx-auto"'
);

// Remove margin top from terminal wrapper
content = content.replace(
  'className="flex-1 w-full max-w-md z-10 mt-12 lg:mt-0"',
  'className="w-full max-w-2xl z-10"'
);

fs.writeFileSync('src/app/LandingAnimation.tsx', content);
