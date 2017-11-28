#!/usr/bin/env node --harmony

const fs = require('file-system');
const _ = require('lodash');

const excludedFiles = ['.DS_Store', '.git', '.gitignore','DO NOT PUT ANYTHING IN THIS DIRECTORY.md','README.md']; // because there are other files in the repo that are not modules
const notPinnedDepRegEx = /^((\")?(\^){1}[0-9]+\.[0-9]+\.[0-9]+(\")?)$/; // looks for e.g. "^1.0.0" or ^1.0.0

fs.readdirSync('.').forEach(file => {
  openModule(file);
});

function openModule(file) {
    if (excludedFiles.indexOf(file) <= -1) {
        let packageJson = JSON.parse(fs.readFileSync(`./${file}/package.json`, 'utf8'));

        return getDependencies(packageJson);
    }
}

function getDependencies(packageJson) {
    if (_.isEmpty(packageJson.dependencies) && _.isEmpty(packageJson.devDependencies)) {
        return console.log(`${packageJson.name} has no dependencies :(`);
    }

    let dependencies = Object.assign(packageJson.dependencies || {} , packageJson.devDependencies || {});

    return moduleInfo(packageJson.name, dependencies);
}

function moduleInfo(moduleName, dependencies) {
    let deps = Object.entries(dependencies);

    console.log("*** MODULE NAME ***");
    console.log(moduleName);
    console.log("*********");

    console.log("=== PINNED DEPENDENCY ===");
    deps.forEach(dependency => {
        if(!notPinnedDepRegEx.test(dependency[1])) {
            console.log(`NAME: ${dependency[0]} | VERSION: ${dependency[1]}`);
        }
    });
    console.log("=========");
    console.log("")
}
