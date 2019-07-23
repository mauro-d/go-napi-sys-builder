'use strict'

const rimraf = require('rimraf')
const fs = require('fs')
const { promisify } = require('util')

const mkdir = promisify(fs.mkdir)

// Maker

function errOnMakeDir(err) {
    if (err.code !== 'EEXIST') {
        console.error('err creating dir', err)
        throw err
    } else {
        console.log('directory already exists')
    }
}

function makeMkDir(path, options) {
    return function mkDir() {
        console.log('called mkDir')
        return mkdir(path, options).catch(errOnMakeDir)
    }
}

function makeMkDirs(optObjs) {
    const makers = optObjs.map(obj => makeMkDir(obj.path, obj.options))
    return function mkDirs() {
        return Promise.all(makers.map(maker => maker()))
    }
}

// Cleaner

function makeCleanDirectory(path) {
    console.log('called makeCleanDirectory')
    return function cleanDirectory() {
        console.log('called cleanDirectory')
        return new Promise((resolve, reject) => {
            rimraf(path, function onRemovingDirectory(err) {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}

function makeDirectoryCleaners(paths) {
    return paths.map(makeCleanDirectory)
}

function makeCleanDirectories(paths) {
    const cleaners = makeDirectoryCleaners(paths)
    return function () {
        return Promise.all(cleaners.map(cleaner => cleaner()))
    }
}

module.exports = {
    makeMkDir,
    makeMkDirs,
    errOnMakeDir,
    makeCleanDirectory,
    makeCleanDirectories
}