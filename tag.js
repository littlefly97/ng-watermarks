const { exec } = require('child_process');
const fs = require('fs');
const archiver = require('archiver');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function createZip(inputDirectory, outputFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(inputDirectory, false);
    archive.finalize();
  });
}

async function hasUncommittedChanges() {
  const status = await executeCommand('git status --porcelain');
  return !!status;
}

async function hasUnpushedCommits() {
  const unpushedCommits = await executeCommand('git log @{u}.. --pretty=%H');
  return !!unpushedCommits;
}

async function hasNewCommitsSinceLastTag(lastTag) {
  const newCommits = await executeCommand(`git rev-list ${lastTag}..HEAD --count`);
  return parseInt(newCommits, 10) > 0;
}

async function main() {
  let isFirst = false;
  try {
    let latestTag = await executeCommand('git describe --tags --abbrev=0').catch(() => null);
    if (await hasUncommittedChanges()) {
      console.error('There are uncommitted changes. Please commit or stash them before creating a new tag.');
      process.exit(1);
    }

    if (await hasUnpushedCommits()) {
      console.error('There are unpushed commits. Please push them before creating a new tag.');
      process.exit(1);
    }

    if (!(await hasNewCommitsSinceLastTag(latestTag))) {
      console.error('There are no new commits since the last tag. Please make some changes before creating a new tag.');
      process.exit(1);
    }
    console.log('Building the project...');
    await executeCommand('ng build ng-watermark --configuration production');
    console.log('Project build completed.');

    if (!latestTag) {
      isFirst = true;
      console.log('No tags found. Using initial commit as the base.');
      latestTag = '1.0.0';
    }

    console.log(`Latest tag: ${latestTag}`);

    readline.question('Choose update type (major/minor/patch): ', async (updateType) => {
      if (!['major', 'minor', 'patch'].includes(updateType)) {
        console.error('Invalid update type. Must be "major", "minor", or "patch".');
        readline.close();
        process.exit(1);
      }
      let newTag = '';
      if (!isFirst) {
        const [major, minor, patch] = latestTag.split('.').map(Number);

        switch (updateType) {
        case 'major':
          newTag = `${major + 1}.0.0`;
          break;
        case 'minor':
          newTag = `${major}.${minor + 1}.0`;
          break;
        case 'patch':
          newTag = `${major}.${minor}.${patch + 1}`;
          break;
        }
      } else {
        newTag = latestTag;
      }

      console.log(`New tag: ${newTag}`);

      await executeCommand(`git tag ${newTag}`);
      console.log(`Tag ${newTag} created.`);

      console.log('Showing changes since the latest tag:');
      const changes = await executeCommand(`git diff ${latestTag} HEAD --name-status`);
      console.log(changes);

      await createZip('dist/ng-watermark', `dist/ng-watermark/${newTag}.zip`);
      console.log(`ZIP archive created: dist/ng-watermark/${newTag}.zip`);

      //   await executeCommand(`tar -czvf dist/ng-watermark/${newTag}.tar.gz -C dist/ng-watermark .`);
      await executeCommand(`git archive -o dist/ng-watermark/${newTag}.tar.gz HEAD`);
      console.log(`TAR.GZ archive created: dist/ng-watermark/${newTag}.tar.gz`);

      console.log('Pushing the new tag to GitHub...');
      await executeCommand('git push --tags');
      console.log('New tag pushed to GitHub.');
      readline.close();
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    readline.close();
  }
}

main();
