'use strict'

const path = require('path')

const cfg = require('./config')
const copy = require('./utils/copy')
const directory = require('./utils/directory')
const download = require('./utils/download')
const unzip = require('./utils/unzip')

// Directory
const errOnMakeDir = directory.errOnMakeDir
const makeBuildDir = directory.makeMkDir(cfg.directories.build.path)
const makeSourcesDir = directory.makeMkDir(cfg.directories.sources.path)
const makeHeadersDir = directory.makeMkDir(cfg.directories.headers.path)
/* function makeGetOptObjs(cfg) {
    return function getOptObjs(dir) {
        return {
            path: cfg.directories[dir].path,
            options: undefined
        }
    }

}
const optObjs = Object.keys(cfg.directories).map(makeGetOptObjs(cfg)) */
const optObjs = [
    {
        path: cfg.directories.headers.path
    },
    {
        path: cfg.directories.sources.path
    }
]
const makeSiblingDirs = directory.makeMkDirs(optObjs)

// Download
const sourcesUrl = cfg.nodeRelease.url + '/' + cfg.nodeRelease.files.headers
const sourcesDestFile = path.join(cfg.directories.sources.path, cfg.nodeVersion + '.tar.gz')
const downloadSources = download.makeDownloadSources(sourcesUrl, sourcesDestFile)

function downloadSuccess() {
    return true
}

function downloadSourcesAndNotify() {
    return downloadSources()
        .then(downloadSuccess)
}

// Unzip
const unzipSources = unzip.makeUnzip(sourcesDestFile, cfg.directories.sources.path)

function unzipIfDownloadSuccess(success) {
    if (success) {
        console.log('download happened')
        return unzipSources()
    } else {
        console.log('download not happened')
    }
}

// Copy
function makeGetPathObjects(cfg) {
    return function getPathObjects(file) {
        return {
            src: path.join(cfg.directories.sources.path, cfg.headerFiles.path, file.name),
            dest: path.join(cfg.directories.headers.path, file.name)
        }
    }
}
const paths = cfg.headerFiles.files.map(makeGetPathObjects(cfg))
const copyHeaders = copy.makeCopyFiles(paths)

// Unzip and/or Download
function unzipOrDownloadSources() {
    return unzipSources()
        .catch(downloadSourcesAndNotify)
        .then(unzipIfDownloadSuccess)
}

// End build handlers
function onEndTaskSuccess(res) {
    console.log('onEndTaskSuccess')
}

function onEndTaskFail(err) {
    console.log('### onEndTaskFail ###')
    if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
        console.error('connection issues')
    } else if (err.code === 'ENOENT') {
        console.error('no such file or directory at path:', err.path)
    }
    console.log('### onEndTaskFail ###')
    console.error('onEndTaskFail', err)
}

// Run pipeline
makeBuildDir()
    .then(makeSiblingDirs)
    //.catch(errOnMakeDir)
    //.then(makeSourcesDir)
    //.catch(errOnMakeDir)
    //.then(makeHeadersDir)
    //.catch(errOnMakeDir)
    // makeDirectories()
    .then(unzipOrDownloadSources)
    //.then(downloadSources)
    //.then(unzipSources)
    .then(copyHeaders)

    .then(onEndTaskSuccess)
    .catch(onEndTaskFail)

/* makeSourcesDir()
    .catch(errOnMakeDir)
    .then(makeNodeDir)
    .catch(errOnMakeDir)
    .then(getSources)
    .then(unzipSources)
    .then(makeFilesDir)
    .catch(errOnMakeDir)
    //.then(copyFiles)
    .then(copyHeaderFiles)
    .then(onEndTaskSuccess)
    .catch(onEndTaskFail)
    .then(() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 3000)
        })
    })
    .then(cleanDirectories) */
