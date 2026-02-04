const fs = require('fs');
const path = require('path');

const url = process.argv[2] || process.env.DEPLOY_URL;
if (!url) {
  console.error('Usage: node update-appjson.js <DEPLOY_URL>');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), 'app.json');
const raw = fs.readFileSync(filePath, 'utf8');
let json = JSON.parse(raw);
json.expo = json.expo || {};
json.expo.extra = json.expo.extra || {};
json.expo.extra.SERVER_URL = url;
fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
console.log('Updated app.json extra.SERVER_URL ->', url);