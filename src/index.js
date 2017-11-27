import fs from 'file-system';
import _ from 'lodash';

const excludedFiles = ['.DS_Store', '.git', '.gitignore','DO NOT PUT ANYTHING IN THIS DIRECTORY.md','README.md'];
const pinnedDepRegEx = /^((\")?(\^){0}[0-9]+\.[0-9]+\.[0-9]+(\")?)$/;
const forkedRegEx = /^(\")?(git\+ssh)/;

fs.readdirSync('../morph-modules').forEach(file => {
  openModule(file);
});

function openModule(file) {
    if (excludedFiles.indexOf(file) <= -1) {
        let packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../morph-modules/${file}/package.json`, 'utf8'));

        return getDependencies(packageJson);
    }
}

function getDependencies(packageJson) {
    if (_.isEmpty(packageJson.dependencies) === false && _.isEmpty(packageJson.devDependencies) === false) {
        let dependencies = Object.assign(packageJson.dependencies, packageJson.devDependencies);

        return moduleInfo(packageJson.name, dependencies);
    } else if (_.isEmpty(packageJson.dependencies) === false) {
        return moduleInfo(packageJson.name, packageJson.dependencies);
    } else if (_.isEmpty(packageJson.devDependencies) === false) {
        return moduleInfo(packageJson.name, packageJson.devDependencies);
    }
}

function moduleInfo(moduleName, dependencies) {
    let deps = Object.entries(dependencies);

    console.log("*** MODULE NAME ***");
    console.log(moduleName);
    console.log("*********");
    console.log("");

    console.log("=== PINNED DEPENDENCY ===");
    deps.forEach(dependency => {
        if(pinnedDepRegEx.test(dependency[1])) {
            console.log(`NAME: ${dependency[0]} | VERSION: ${dependency[1]}`);
        } else if (forkedRegEx.test(dependency[1])) {
            console.log(`NAME: ${dependency[0]} | VERSION: ${dependency[1]}`);
        }
    });
    console.log("=========");
    console.log("")
}
