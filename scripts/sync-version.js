#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '../package.json')
const tauriConfPath = path.join(__dirname, '../src-tauri/tauri.conf.json')

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'))

const version = packageJson.version

if (tauriConf.version !== version) {
  tauriConf.version = version
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n')
  console.log(`✓ Synced version to ${version}`)
} else {
  console.log(`✓ Version already synced (${version})`)
}
