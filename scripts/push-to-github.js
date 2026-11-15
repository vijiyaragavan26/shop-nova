const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'vijiyaragavan26';
const REPO = 'shop-nova';
const TOKEN = process.env.GITHUB_TOKEN || process.argv[2];

if (!TOKEN) {
  console.error('❌ Error: GitHub Token is required.');
  console.error('Usage: node scripts/push-to-github.js <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>');
  process.exit(1);
}

function githubRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'User-Agent': 'ShopNova-Deployer',
        Authorization: `token ${TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(json);
        } else {
          reject(new Error(`GitHub API Error (${res.statusCode}): ${json.message || body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const ignoredPaths = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.env',
  '.DS_Store'
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (ignoredPaths.includes(file)) return;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function main() {
  console.log(`🚀 Preparing to push ShopNova codebase to https://github.com/${OWNER}/${REPO}...`);

  const rootDir = path.resolve(__dirname, '..');
  const allFiles = getAllFiles(rootDir);
  console.log(`📦 Found ${allFiles.length} files to upload (excluding node_modules, dist, .env).`);

  // 1. Create blobs for each file
  console.log('⏳ Uploading file blobs to GitHub...');
  const treeItems = [];

  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');

    // Skip the push script itself if desired, or include it
    const content = fs.readFileSync(filePath);
    const base64Content = content.toString('base64');

    const blob = await githubRequest('/git/blobs', 'POST', {
      content: base64Content,
      encoding: 'base64'
    });

    treeItems.push({
      path: relativePath,
      mode: '100644',
      type: 'blob',
      sha: blob.sha
    });

    process.stdout.write(`\r   [${i + 1}/${allFiles.length}] Uploaded: ${relativePath}`);
  }
  console.log('\n✅ All blobs uploaded successfully.');

  // 2. Create Git Tree
  console.log('⏳ Creating Git tree...');
  const tree = await githubRequest('/git/trees', 'POST', {
    tree: treeItems
  });
  console.log('✅ Git Tree created:', tree.sha);

  // 3. Create Commit
  console.log('⏳ Creating Initial Commit...');
  const commit = await githubRequest('/git/commits', 'POST', {
    message: 'Initial commit: ShopNova Full-Stack E-Commerce Platform (React, Node.js, Express, MongoDB)',
    tree: tree.sha
  });
  console.log('✅ Commit created:', commit.sha);

  // 4. Update or Create Branch 'main'
  console.log('⏳ Updating branch refs/heads/main...');
  try {
    await githubRequest('/git/refs/heads/main', 'PATCH', {
      sha: commit.sha,
      force: true
    });
  } catch (err) {
    // If ref does not exist yet (empty repo)
    await githubRequest('/git/refs', 'POST', {
      ref: 'refs/heads/main',
      sha: commit.sha
    });
  }

  console.log('------------------------------------------------------------');
  console.log(`🎉 SUCCESS! All files pushed to https://github.com/${OWNER}/${REPO}`);
  console.log('------------------------------------------------------------');
}

main().catch((err) => {
  console.error('\n❌ Push failed:', err.message);
  process.exit(1);
});
