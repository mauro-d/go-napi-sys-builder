'use strict'

const pump = require('pump')
const tar = require('tar')
const { createReadStream } = require('fs')

function makeUnzip(src, dest) {
    return function unzip() {
        console.log('unzipping sources...')
        return new Promise((resolve, reject) => {
            pump(
                createReadStream(src),
                tar.x({
                    strip: 1,
                    C: dest
                }),
                function onEnd(err) {
                    if (err) {
                        console.log('error unzipping sources...')
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
    makeUnzip
}