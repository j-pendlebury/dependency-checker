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
        console.log(`ℹ️  MODULE NAME: ${moduleName}`);
        console.log("=== PINNED DEPENDENCIES ===");

        pinnedList.forEach(pinned => {
            console.log(pinned);
        });

        console.log("====================================");
        console.log("");
        console.log("");
    } else {
        console.log(`ℹ️  MODULE NAME: ${moduleName}`);
        console.log("===")
        console.log("✅  no pinned dependencies 🎉");
        console.log("====================================");
        console.log("");
        console.log("");
    }
}
