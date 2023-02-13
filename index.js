#!/usr/bin/env node

// Usage: npx codespace-10k

const fs = require('fs');
const path = require('path');

const currentDir = process.cwd(),
    devContainerPath = path.join(currentDir, ".devcontainer"),
    devContainerJsonPath = path.join(devContainerPath, "devcontainer.json"),
    setupCS10kPath = path.join(devContainerPath, "setup-codespace-10k.sh"),
    packageJsonPath = path.join(currentDir, "package.json");

// .devcontainer

let devcontainerJson = {}
if(!fs.existsSync(devContainerPath)) fs.mkdirSync(devContainerPath, { recursive: true });
if(fs.existsSync(devContainerJsonPath)) devcontainerJson=JSON.parse(fs.readFileSync(devContainerJsonPath))
if(!devcontainerJson.forwardPorts) devcontainerJson.forwardPorts=[]
devcontainerJson.forwardPorts.push(10000)
devcontainerJson.postAttachCommand = ((devcontainerJson.postAttachCommand)? devcontainerJson.postAttachCommand + " && " : "") + "/bin/bash .devcontainer/setup-codespace-10k.sh"
fs.writeFileSync(devContainerJsonPath, JSON.stringify(devcontainerJson, null, 2))
fs.writeFileSync(setupCS10kPath, `#!/bin/sh
gh codespace ports visibility 10000:public -c $CODESPACE_NAME
npm i && npm run dev`)

// package.json

let packageJson = {}
if(fs.existsSync(packageJsonPath)) packageJson=JSON.parse(fs.readFileSync(packageJsonPath))
if(!packageJson.scripts) packageJson.scripts={}
packageJson.scripts["cs-port"] = "gh codespace ports visibility 10000:public -c $CODESPACE_NAME"
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log('Success! Use: npm run cs-port');