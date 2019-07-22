'use strict'

const fs = require('fs')
const { promisify } = require('util')

const copyFile = promisify(fs.copyFile)

function onCopyFileErr(err) {
    if (err.code === 'ENOENT') {
        console.log('source file not found')
    } else {
        throw err
    }
}

function makeCopyFile(src, dest) {
    return function () {
        return copyFile(src, dest).catch(onCopyFileErr)
    }
}

function makeCopyFiles(paths) {
    const cloners = paths.map(path => makeCopyFile(path.src, path.dest))
    return function copyFiles() {
        return Promise.all(cloners.map(cloner => cloner()))
    }
}

module.exports = {
    makeCopyFiles
}