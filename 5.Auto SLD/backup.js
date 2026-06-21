const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const backupsDir = path.join(srcDir, 'backups');

// Ensure backups directory exists
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Find the next version number
let nextVersion = 1;
const files = fs.readdirSync(backupsDir);
const versionFolders = files.filter(f => {
  const stat = fs.statSync(path.join(backupsDir, f));
  return stat.isDirectory() && /^Backup V\.\d+$/i.test(f);
});

if (versionFolders.length > 0) {
  const numbers = versionFolders.map(f => {
    const match = f.match(/^Backup V\.(\d+)$/i);
    return match ? parseInt(match[1], 10) : 0;
  });
  nextVersion = Math.max(...numbers) + 1;
}

const targetDirName = `Backup V.${nextVersion}`;
const targetDir = path.join(backupsDir, targetDirName);
fs.mkdirSync(targetDir, { recursive: true });

// Helper to recursively copy directory contents ignoring specific folders
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    const baseName = path.basename(src);
    // Ignore patterns
    if (baseName === 'node_modules' || baseName === 'backups' || baseName === '.git') {
      return;
    }
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    // It's a file
    const baseName = path.basename(src);
    if (baseName === 'backup.js') {
      return; // Skip backup script itself
    }
    fs.copyFileSync(src, dest);
  }
}

console.log(`Starting backup of ${srcDir} into ${targetDir}...`);
try {
  fs.readdirSync(srcDir).forEach(child => {
    copyRecursive(path.join(srcDir, child), path.join(targetDir, child));
  });
  console.log(`Backup completed successfully! Saved as backups/${targetDirName}`);
} catch (err) {
  console.error('Backup failed:', err);
  process.exit(1);
}
