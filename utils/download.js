'use strict'

const got = require('got')
const pump = require('pump')
const { createWriteStream } = require('fs')

function makeDownloadSources(src, dest) {
    return function downloadSources() {
        console.log('downloading sources...')
        return new Promise((resolve, reject) => {
            pump(
                got.stream(src),
                createWriteStream(dest),
                function onEnd(err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }
}

module.exports = {
    makeDownloadSources
}