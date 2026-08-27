const fs = require('fs');
let content = fs.readFileSync('src/app/admin/modul/LearningHubClient.tsx', 'utf8');

content = content.replace(
  '"Swarm [TX -> "',
  '"Swarm [TX -&gt; "'
);

fs.writeFileSync('src/app/admin/modul/LearningHubClient.tsx', content);
