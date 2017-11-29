#!/usr/bin/env node --harmony

const fs = require('file-system');
const _ = require('lodash');

const excludedFiles = ['.DS_Store', '.git', '.gitignore','DO NOT PUT ANYTHING IN THIS DIRECTORY.md','README.md', 'morph-developer-console-state.json']; // because there are other files in the repo that are not modules
const notPinnedDepRegEx = /^((\")?(\^){1}[0-9]+\.[0-9]+\.[0-9]+(\")?)$/; // looks for e.g. "^1.0.0" or ^1.0.0

fs.readdirSync('.').forEach(directory => {
  openModule(directory);
});

function openModule(module) {
    if (excludedFiles.indexOf(module) <= -1) {
        let packageJson = JSON.parse(fs.readFileSync(`./${module}/package.json`, 'utf8'));

        return getDependencies(packageJson);
    }
}

function getDependencies(packageJson) {
    if (_.isEmpty(packageJson.dependencies) && _.isEmpty(packageJson.devDependencies)) {
        console.log(`👎  MODULE NAME: ${packageJson.name.replace('bbc-morph-', '')}`);
        console.log("===")
        console.log("😢  has no dependencies");
        console.log("====================================");
        console.log("");
        return console.log("");
    }

    let dependencies = Object.assign(packageJson.dependencies || {} , packageJson.devDependencies || {});

    return moduleInfo(packageJson.name, dependencies);
}

function moduleInfo(moduleName, dependencies) {
    let deps = Object.entries(dependencies),
        depArray = [];

    deps.forEach(dependency => {
        if(!notPinnedDepRegEx.test(dependency[1])) {
            depArray.push(`💩  ${dependency[0]} => ${dependency[1]}`);
        }
    });

    return listPinnedDependencies(moduleName, depArray);
}

function listPinnedDependencies(moduleName, pinnedList) {
    if (pinnedList.length > 0) {
        console.log(`ℹ️  MODULE NAME: ${moduleName.replace('bbc-morph-', '')}`);
        console.log("⚠️  PINNED DEPENDENCIES:");

        pinnedList.forEach(pinned => {
            console.log(pinned);
        });

        console.log("====================================");
        console.log("");
        console.log("");
    } else {
        console.log(`ℹ️  MODULE NAME: ${moduleName.replace('bbc-morph-', '')}`);
        console.log("===")
        console.log("✅  no pinned dependencies 🎉");
        console.log("====================================");
        console.log("");
        console.log("");
    }
}
