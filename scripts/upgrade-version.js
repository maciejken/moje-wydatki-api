// TODO: convert to typescript and move to src/scripts

const { exec } = require('child_process');

const packageJson = require('../package.json');
const { version } = packageJson;
const [major, minor, patchTemp] = version?.split('.');

const [,, upgradeType] = process.argv;
const allowedTypes = ['major', 'minor', 'patch', 'dev'];
const patch = patchTemp?.replace(/\D/g, '');

const upgradeMap = {
  major: `${+major + 1}.0.0`,
  minor: `${+major}.${+minor + 1}.0`,
  patch: `${+major}.${+minor}.${+patch + 1}`,
  dev: `${+major}.${+minor}.${+patch + 1}-dev`,
};

if (!upgradeType || allowedTypes.indexOf(upgradeType) < 0) {
  console.error('Invalid upgrade type, usage: upgrade-version.js major|minor|patch|dev');
  process.exit(1);
} else {
  const newVersion = upgradeMap[upgradeType];
  exec(`npm version ${newVersion}`);
  console.info(newVersion);
}